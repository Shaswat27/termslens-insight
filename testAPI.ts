// testApi.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

// --- Configuration ---
const API_URL = 'http://localhost:3000/api/analyze';
const OUTPUT_FILE = 'analysis_result.json';
// ---------------------

async function testApiEndpoint() {
  // 1. Get file path from command line arguments
  const filePathArg = process.argv[2];
  if (!filePathArg) {
    console.error(
      '❌ Error: Please provide a file path as an argument.',
    );
    console.log('Usage: node testApi.js <path/to/your/file.pdf|docx>');
    process.exit(1);
  }

  const absoluteFilePath = path.resolve(filePathArg);
  const fileName = path.basename(absoluteFilePath);

  // Check if file exists
  if (!fs.existsSync(absoluteFilePath)) {
    console.error(`❌ Error: File not found at ${absoluteFilePath}`);
    process.exit(1);
  }

  console.log(`Attempting to upload: ${fileName}`);
  console.log(`Target endpoint: ${API_URL}\n`);

  try {
    // 2. Create the FormData payload
    const form = new FormData();
    // We use a ReadStream, which is efficient for large files
    form.append('file', fs.createReadStream(absoluteFilePath), {
      filename: fileName,
    });

    // 3. Make the POST request with axios
    console.log('Sending request...');
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(), // This is crucial to set the 'Content-Type: multipart/form-data; boundary=...'
      },
      // Set a reasonable timeout (e.g., 60s) for extraction + analysis
      timeout: 150000, 
    });

    // 4. Handle successful response
    console.log(`✅ Success! (Status: ${response.status})`);

    // Pretty-print the JSON response
    const resultJson = JSON.stringify(response.data, null, 2);
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);

    // 5. Save the result JSON to the root directory
    await fs.promises.writeFile(outputPath, resultJson, 'utf-8');
    console.log(`\nResult JSON saved to: ${outputPath}`);
    console.log('You can now open this file to check the output.');

  } catch (error: unknown) {
    // 6. Handle errors (fully type-safe)
    console.error('❌ API Test Failed.');

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`Server responded with Status: ${error.response.status}`);
        console.error('Error Body:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server. Is it running?');
        console.error(error.message);
      } else {
        // Something happened in setting up the request
        console.error('Axios Error:', error.message);
      }
    } else if (error instanceof Error) {
        // Other non-Axios errors (e.g., file read)
        console.error('Error:', error.message);
    } else {
        // Unknown error
        console.error('An unknown error occurred:', error);
    }
    process.exit(1);
  }
}

// Run the test
void testApiEndpoint();