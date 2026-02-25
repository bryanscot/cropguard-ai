import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the Gemini API with your key from the .env file
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * System Instruction: Sets the persona and rules for the AI.
 * We use this to ensure the AI always returns the exact JSON structure the frontend expects.
 */
const SYSTEM_PROMPT = `
  You are an expert plant pathologist and agronomist. 
  Your task is to analyze images of plant leaves to identify the plant species and any diseases present.

  RULES:
  1. Identify the 'plantName' (e.g., "Tomato").
  2. Identify the 'diseaseName' (e.g., "Early Blight"). If the plant is healthy, set this to "Healthy".
  3. Provide a 'confidence' score between 0 and 100.
  4. Provide 'organicTreatment' as an array of 2-3 natural remedies.
  5. Provide 'chemicalTreatment' as an array of 2-3 specific active ingredients or products.
  6. Provide 'preventionTips' as an array of 2-3 ways to avoid this in the future.
  7. Return ONLY a valid JSON object. Do not include any conversational text or markdown code blocks like \`\`\`json.
`;

// 2. We use Gemini 2.5 Flash for high-speed, cost-effective multimodal analysis
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

/**
 * Helper: Converts a browser File object to a Base64 string for the API
 */
async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
}

/**
 * Main function called by the ScanPage to process the image
 */
export const analyzePlantImage = async (file: File) => {
  try {
    const imagePart = await fileToGenerativePart(file);

    // Using a simple user prompt as the core instructions are in the systemInstruction
    const result = await model.generateContent([
      imagePart,
      "Analyze this leaf and provide the diagnosis in JSON format.",
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up response: sometimes Gemini includes markdown wrappers even when told not to
    const cleanedJson = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      "Failed to analyze image. Please check your API key and connection.",
    );
  }
};
