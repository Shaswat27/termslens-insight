import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable, { type File } from 'formidable'; // Import File type
import fs from 'fs/promises';
import { extractText } from './_utils/extractText.js';
import { analyzeTextWithGemini } from './_utils/analyzeText.js';
import type { AnalysisResult } from './_utils/types.js'; // Your shared type

// Define allowed file types
const ALLOWED_MIMETYPES: string[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
];

// Disable Vercel's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> { // Explicit return type
  // 1. Handle only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // 2. Parse the multipart/form-data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      uploadDir: '/tmp', // formidable will stream file to a temp path
    });

    const [fields, files] = await form.parse(req);

    // 3. Validate the uploaded file (Type-safe handling)
    const fileOrFileArray = files.file; // This is `File | File[] | undefined`

    if (!fileOrFileArray) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    // Handle both single file and array upload, taking only the first file
    const file: File = Array.isArray(fileOrFileArray)
      ? fileOrFileArray[0]
      : fileOrFileArray;

    const mimeType: string | null = file.mimetype;
    const filePath: string = file.filepath;

    if (!mimeType || !ALLOWED_MIMETYPES.includes(mimeType)) {
      res.status(400).json({
        error: 'Unsupported file type. Please upload a PDF or .docx file.',
      });
      return;
    }

    // 4. Read the file buffer from the temporary path
    const fileBuffer: Buffer = await fs.readFile(filePath);

    // 5. Orchestration: Call your utility functions
    // Step 5a: Extract text
    const extractedText: string = await extractText(fileBuffer, mimeType);

    if (!extractedText || extractedText.trim().length < 100) {
      res.status(400).json({
        error: 'Could not extract meaningful text from the document.',
      });
      return;
    }

    // Step 5b: Analyze text with Gemini
    const analysisResult: AnalysisResult =
      await analyzeTextWithGemini(extractedText);

    // 6. Send the successful response
    res.status(200).json(analysisResult);

  } catch (error: unknown) { // 7. Handle errors (Type-safe)
    console.error('Error in /api/analyze:', error);

    let errorMessage = 'An unknown server error occurred.';
    let statusCode = 500;

    // Use type guard
    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for formidable file size error
      if (error.message.includes('maxFileSize')) {
        statusCode = 413; // Payload Too Large
        errorMessage = 'File size exceeds 10MB limit.';
      }
      
      // Check for custom errors thrown from extractText/analyzeText
      if (error.message.includes('Unsupported file type')) {
          statusCode = 400;
      }
    }

    res.status(statusCode).json({ error: errorMessage });
  }
}