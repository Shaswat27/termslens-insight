import * as dotenv from 'dotenv';
import path from 'path';

// --- Load Environment Variables ---
// THIS MUST BE THE VERY FIRST THING THAT RUNS.
// It ensures process.env is populated *before* any other module (like analyzeText)
// is imported and reads process.env at its top level.
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  console.warn(`Warning: Could not find or read .env.local file at ${envPath}.`);
  console.warn('Proceeding without loading .env.local. This may cause errors if GOOGLE_API_KEY is not set globally.');
} else {
  console.log('Successfully loaded environment variables from .env.local');
}
// ----------------------------------

// NOW we can safely import other modules that depend on process.env
import fs from 'fs/promises';
// Adjust this import path if your compiled JS file is in a different location (e.g., './dist/api/_utils/analyzeText.js')
import { analyzeTextWithGemini } from './api/_utils/analyzeText.js'; 

async function main() {
  try {
    // 1. Get the input file path from command line arguments
    const inputFileName = process.argv[2];
    if (!inputFileName) {
      console.error('Error: Please provide a path to a .txt file as an argument.');
      console.log('Usage: ts-node ./runAnalysis.ts <path-to-your-file.txt>');
      process.exit(1); // Exit with an error code
    }

    const inputFilePath = path.resolve(process.cwd(), inputFileName);

    // 2. Read the text content from the specified file
    let extractedText: string;
    try {
      extractedText = await fs.readFile(inputFilePath, 'utf-8');
      console.log(`Successfully read file: ${inputFileName}`);
    } catch (readError) {
      console.error(`Error: Failed to read file at ${inputFilePath}`, readError);
      process.exit(1);
    }

    if (!extractedText.trim()) {
      console.error('Error: The input file is empty.');
      process.exit(1);
    }

    // 3. Call the analysis function with the file's content
    console.log('Starting analysis with Gemini... (This may take a moment)');
    const analysisResult = await analyzeTextWithGemini(extractedText);

    // 4. Print the final result
    console.log('\n--- Analysis Complete ---');
    // console.log(JSON.stringify(analysisResult, null, 2));

  } catch (error) {
    console.error('\nAn unexpected error occurred during the analysis pipeline:', error);
    process.exit(1);
  }
}

// Execute the main function
main();