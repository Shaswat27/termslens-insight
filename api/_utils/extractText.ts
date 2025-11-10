// /api/_utils/extractText.ts
import fs from 'fs/promises';
import path from 'path';
// Correct v2 Import: Use the named export PDFParse
import {PDFParse, type LoadParameters} from 'pdf-parse';
import mammoth from 'mammoth';

// Define supported MIME types
const SUPPORTED_MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[keyof typeof SUPPORTED_MIME_TYPES];

// Define expected structure from pdf-parse getText result (based on docs)
// Note: Actual structure might vary slightly, adjust if needed after testing
interface PdfTextResult {
  text: string;
  // V2 getText might not return all the fields v1 did directly
  // numpages, info, etc., might come from getInfo() if needed separately
}

// Define expected structure from mammoth.extractRawText
interface MammothResult {
    value: string;
    messages: unknown[];
}

/**
 * Extracts text content from a PDF or DOCX file buffer using pdf-parse v2.
 * For debugging, also writes the extracted text to a file in the project root.
 *
 * @param fileBuffer The buffer containing the file content.
 * @param mimeType The MIME type of the file.
 * @returns A promise that resolves with the extracted text.
 * @throws An error if the file type is unsupported or if parsing fails.
 */
export async function extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
  let extractedText: string;
  // Define parser variable outside switch for potential destroy() call in finally
  let parser: PDFParse | undefined;

  console.log(`Attempting to extract text for MIME type: ${mimeType}`);

  try {
    switch (mimeType) {
      case SUPPORTED_MIME_TYPES.PDF:
        console.log('Parsing PDF using PDFParse class v2...');

        // --- Use the PDFParse class ---
        // Instantiate the parser with the buffer using the 'data' option
        // as hinted in the LoadParameters documentation link (though not shown directly).
        const loadParams: LoadParameters = { data: fileBuffer };
        parser = new PDFParse(loadParams);

        // Call the getText method
        // Assuming getText returns an object with a 'text' property based on docs
        const pdfResult: { text: string } = await parser.getText();
        // --- End ---

        extractedText = pdfResult.text;
        console.log(`PDF parsing successful. Extracted ${extractedText.length} characters.`);
        break;

      case SUPPORTED_MIME_TYPES.DOCX:
        console.log('Parsing DOCX...');
        // Mammoth usage remains the same
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
  } finally {
      // Clean up PDF parser resources if it was instantiated
      if (parser) {
          try {
              await parser.destroy();
              console.log("PDF parser resources released.");
          } catch (destroyError: unknown) {
              const message = destroyError instanceof Error ? destroyError.message : String(destroyError);
              console.error("Error destroying PDF parser:", message);
              // Decide if this should be re-thrown or just logged
          }
      }
  }
}