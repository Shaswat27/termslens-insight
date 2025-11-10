// /api/_utils/extractText.ts
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';

// This import is for pdf-parse v1.1.1
const require = createRequire(import.meta.url);
const PDFParse = require('pdf-parse');
import mammoth from 'mammoth';

// Define supported MIME types
const SUPPORTED_MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  MSWORD: 'application/msword',
} as const;

type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[keyof typeof SUPPORTED_MIME_TYPES];

// Define expected structure from mammoth.extractRawText
interface MammothResult {
    value: string;
    messages: unknown[];
}

export async function extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
  let extractedText: string;

  console.log(`Attempting to extract text for MIME type: ${mimeType}`);

  try {
    switch (mimeType) {
      case SUPPORTED_MIME_TYPES.PDF:
        console.log('Parsing PDF using pdf-parse v1.1.1...');

        // --- v1.1.1 is a function, not a class ---
        const data = await PDFParse(fileBuffer);
        extractedText = data.text;
        // --- End of change ---

        console.log(`PDF parsing successful. Extracted ${extractedText.length} characters.`);
        break;

      case SUPPORTED_MIME_TYPES.MSWORD:
      case SUPPORTED_MIME_TYPES.DOCX:
        console.log('Parsing DOCX...');
        const docxResult: MammothResult = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = docxResult.value;
        console.log(`DOCX parsing successful. Extracted ${extractedText.length} characters.`);
        break;

      default:
        console.error(`Unsupported file type: ${mimeType}`);
        if (!Object.values(SUPPORTED_MIME_TYPES).includes(mimeType as SupportedMimeType)) {
             throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF or DOCX file.`);
        }
        throw new Error(`An unexpected issue occurred with file type: ${mimeType}`);
    }

    // --- Debugging: Write extracted text to a file ---
    const debugFileName = `extracted_debug_${Date.now()}.txt`;
    // --- Vercel ONLY allows writing to /tmp ---
    const debugFilePath = path.join('/tmp', debugFileName);
    try {
      await fs.writeFile(debugFilePath, extractedText);
      console.log(`Debug: Extracted text saved to ${debugFileName}`);
    } catch (writeError: unknown) {
      const message = writeError instanceof Error ? writeError.message : String(writeError);
      console.error(`Debug: Failed to write debug file: ${message}`);
    }
    // --- End Debugging ---

    return extractedText;

  } catch (error: unknown) {
    console.error('Error during text extraction:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to process the document: ${message}`);
  }
}