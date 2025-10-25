// testExtract.ts
import fs from 'fs/promises';
import path from 'path';
import { extractText } from './api/_utils/extractText.js'; // Adjust path if necessary

// --- File Storage ---
// Create a directory named 'test-files' in your project root.
// Place your sample PDF (.pdf) and DOCX (.docx) files inside this 'test-files' directory.
// Example: project-root/test-files/sample.pdf
// ---

// Map extensions to MIME types
const mimeTypeMap: { [key: string]: string } = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

async function testExtraction(): Promise<void> { // Explicit return type
  const filePathArg = process.argv[2]; // Get file path from command line argument

  if (!filePathArg) {
    console.error('Usage: pnpm tsx testExtract.ts <path/to/your/file.pdf|docx>');
    process.exit(1);
  }

  const absoluteFilePath = path.resolve(filePathArg);
  console.log(`Testing extraction for file: ${absoluteFilePath}`);

  try {
    // 1. Read the file
    const fileBuffer = await fs.readFile(absoluteFilePath);

    // 2. Determine MIME type
    const fileExtension = path.extname(absoluteFilePath).toLowerCase();
    const mimeType = mimeTypeMap[fileExtension];

    if (!mimeType) {
      throw new Error(`Could not determine MIME type for extension: ${fileExtension}. Supported: .pdf, .docx`);
    }

    // 3. Extract text
    console.log(`Using MIME type: ${mimeType}`);
    const extractedText = await extractText(fileBuffer, mimeType);

    // 4. Log results
    console.log('\n--- Extraction Successful ---');
    console.log(`First 500 characters:\n${extractedText.substring(0, 500)}...`);
    console.log(`\nTotal characters extracted: ${extractedText.length}`);
    console.log('(Check the project root for a file named extracted_debug_*.txt for the full text)');

  } catch (error: unknown) { // Catch unknown type
    console.error('\n--- Extraction Failed ---');
    // Check if it's an Error instance before accessing message
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    process.exit(1);
  }
}

// Use void to explicitly ignore the returned promise for top-level async call
void testExtraction();