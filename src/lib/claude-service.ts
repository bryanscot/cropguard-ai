import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  // Note: In a production app, you'd call this through a backend
  // to keep the API key hidden.
  dangerouslyAllowBrowser: true,
});

export const analyzePlantWithClaude = async (file: File) => {
  // Convert file to base64
  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system:
      "You are an expert plant pathologist. Analyze the image and return ONLY a JSON object with: plantName, diseaseName, confidence (0-100), organicTreatment (array), chemicalTreatment (array), and preventionTips (array).",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: file.type as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: "Identify the disease in this plant leaf.",
          },
        ],
      },
    ],
  });

  // Claude is very good at returning clean JSON, but we still parse carefully
  const content = response.content[0];
  if (content.type === "text") {
    return JSON.parse(content.text);
  }
  throw new Error("Unexpected response format from Claude");
};
