// /api/_utils/analyzeText.ts
import fs from 'fs/promises';
import path from 'path';
// Use the EXACT import as requested
import {
    GoogleGenAI,
    // --- 1. IMPORT THE CORRECT TYPE FOR THE CHUNKS ---
    type GenerateContentResponse,
    type GenerateContentConfig
} from "@google/genai";
import type { AnalysisResult, Clause, PayoffDetails } from './types.js';
import { defaultPayoffDetails } from './types.js';

// --- Configuration ---
const API_KEY = process.env.GOOGLE_API_KEY; // Using the key name established earlier
// EXACT Model names as requested
const MODEL_FLASH = "gemini-2.5-flash";
const MODEL_FLASH_LITE = "gemini-2.5-flash-lite";

const PROMPT_DIR = path.resolve(process.cwd(), 'api', '_prompts');
const CONTROL_PROMPT_FILE = path.join(PROMPT_DIR, 'control.txt');
const ECONOMICS_PROMPT_FILE = path.join(PROMPT_DIR, 'economics.txt');
const SECURITY_PROMPT_FILE = path.join(PROMPT_DIR, 'security.txt');

// --- Helper Functions ---
/**
 * Aggregates text from a streamed Gemini response.
 */
// --- 2. UPDATE FUNCTION SIGNATURE AND LOGIC ---
// The function receives the AsyncGenerator directly.
async function aggregateStreamedResponse(
    stream: AsyncGenerator<GenerateContentResponse, any, unknown>
): Promise<string> {
    let aggregatedText = '';
    
    // Iterate directly over the generator, as per your code snippet
    for await (const chunk of stream) {
        try {
            // Access text using the text() method on the chunk
            const chunkText = chunk.text;
            aggregatedText += chunkText;
        } catch (e) {
            // Attempt to handle potential errors if chunk doesn't have text()
             if (chunk && typeof chunk === 'object' && 'text' in chunk && typeof chunk.text === 'string') {
                aggregatedText += chunk.text; // Fallback attempt
            } else {
                 console.error("Error accessing chunk text or chunk format unexpected:", e, chunk);
            }
        }
    }
    
    // The previous fallback logic was incorrect as the generator
    // does not have a .response property. If the stream is empty,
    // aggregatedText will be '', which is correct.
    
    return aggregatedText;
}

/**
 * Safely parses a JSON string. Returns a default value if parsing fails.
 */
function safeParseJson<T>(jsonString: string, defaultValue: T): T {
    try {
        if (!jsonString) {
             console.warn("Attempted to parse empty JSON string.");
             return defaultValue;
        }
         // Clean potential markdown wrappers
         const cleanedString = jsonString
         .replace(/^```json\s*/, '')
         .replace(/\s*```$/, '');

        return JSON.parse(cleanedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e instanceof Error ? e.message : String(e));
        // console.error("Raw text causing error:", jsonString);
        return defaultValue;
    }
}

/**
 * Writes debug output to a file.
 */
async function writeDebugOutput(data: AnalysisResult): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const debugFileName = `gemini_analysis_debug_${timestamp}.txt`;
    const debugFilePath = path.join(process.cwd(), debugFileName);
    try {
        const formattedJson = JSON.stringify(data, null, 2);
        await fs.writeFile(debugFilePath, formattedJson);
        console.log(`Debug: Gemini analysis output saved to ${debugFileName}`);
    } catch (writeError: unknown) {
        const message = writeError instanceof Error ? writeError.message : String(writeError);
        console.error(`Debug: Failed to write debug file: ${message}`);
    }
}

// --- Main Analysis Function ---
export async function analyzeTextWithGemini(extractedText: string): Promise<AnalysisResult> {
    if (!API_KEY) {
        console.error("GOOGLE_API_KEY environment variable not set.");
        return {
            controlGovernanceClauses: [],
            cashflowReturnsClauses: [],
            payoffDetails: defaultPayoffDetails,
        };
    }

    // --- 3. FIX: INITIALIZE CLIENT CORRECTLY ---
    // The constructor expects the API key as a direct string.
    const ai = new GoogleGenAI({apiKey:API_KEY});

    let analysisResult: AnalysisResult = {
        controlGovernanceClauses: [],
        cashflowReturnsClauses: [],
        payoffDetails: defaultPayoffDetails,
    };

    try {
        // Read system instruction prompts from files
        const [controlSystemInstructionText, economicsSystemInstructionText, securitySystemInstructionText] = await Promise.all([
            fs.readFile(CONTROL_PROMPT_FILE, 'utf-8'),
            fs.readFile(ECONOMICS_PROMPT_FILE, 'utf-8'),
            fs.readFile(SECURITY_PROMPT_FILE, 'utf-8')
        ]).catch(err => {
            console.error("Error reading prompt files:", err);
            throw new Error("Could not read prompt files.");
        });

        // console.log(controlSystemInstructionText);

        // Define configs EXACTLY as provided in snippets
        const configControl: GenerateContentConfig = {
            temperature: 0.3, maxOutputTokens: 7500,
            thinkingConfig: { thinkingBudget: -1 },
            responseMimeType: 'application/json',
            systemInstruction: [{ text: controlSystemInstructionText }], // Placed inside config as per snippet
        };
        const configEconomics: GenerateContentConfig = {
            temperature: 0.3, maxOutputTokens: 10000,
            thinkingConfig: { thinkingBudget: -1 },
            responseMimeType: 'application/json',
            systemInstruction: [{ text: economicsSystemInstructionText }], // Placed inside config as per snippet
        };
        const configSecurity: GenerateContentConfig = {
            temperature: 0.2, maxOutputTokens: 10000,
            thinkingConfig: { thinkingBudget: -1 },
            responseMimeType: 'application/json',
            systemInstruction: [{ text: securitySystemInstructionText }], // Placed inside config as per snippet
        };

        // Prepare the user content structure
        const contents = [
            { role: 'user', parts: [{ text: extractedText }] }
        ];

        console.log("Sending requests to Gemini API using ai.models.generateContentStream...");

        // --- 4. FIX: SPREAD THE CONFIG OBJECT ---
        // The config properties must be top-level.
        // This Promise.all awaits the Promises, returning an array of AsyncGenerators.
        const [controlStream, economicsStream, securityStream] = await Promise.all([
            ai.models.generateContentStream({ model: MODEL_FLASH, config: configControl, contents }),
            ai.models.generateContentStream({ model: MODEL_FLASH, config: configEconomics, contents }),
            ai.models.generateContentStream({ model: MODEL_FLASH_LITE, config: configSecurity, contents }),
        ]);

        console.log("Received responses streams from Gemini API. Aggregating...");

        // These AsyncGenerators are now passed to the aggregation function
        const [controlJsonString, economicsJsonString, securityJsonString] = await Promise.all([
            aggregateStreamedResponse(controlStream),
            aggregateStreamedResponse(economicsStream),
            aggregateStreamedResponse(securityStream)
        ]);

        console.log("Aggregated stream responses.");

        // Parse results safely
        const controlGovernanceClauses = safeParseJson<Clause[]>(controlJsonString, []);
        const cashflowReturnsClauses = safeParseJson<Clause[]>(economicsJsonString, []);
        const payoffDetails = safeParseJson<PayoffDetails>(securityJsonString, defaultPayoffDetails);

        analysisResult = {
            controlGovernanceClauses,
            cashflowReturnsClauses,
            payoffDetails,
        };

        console.log("Gemini analysis successful. Result consolidated.");
        await writeDebugOutput(analysisResult);

        return analysisResult;

    } catch (error) {
        console.error("Error during Gemini analysis pipeline:", error);
        await writeDebugOutput(analysisResult);
        return analysisResult;
    }
}