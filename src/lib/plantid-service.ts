// src/lib/plantid-service.ts
const API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY;
const API_URL = "https://api.plant.id/v3/identification";

export const analyzeWithPlantId = async (file: File) => {
  // 1. Clean Base64 Conversion
  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      // Remove the "data:image/jpeg;base64," prefix strictly
      resolve(res.replace(/^data:image\/\w+;base64,/, ""));
    };
    reader.readAsDataURL(file);
  });

  // 2. Optimized Request Body
  const response = await fetch(
    `${API_URL}?language=en&details=common_names,description,treatment`,
    {
      method: "POST",
      headers: {
        "Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: [base64Image],
        health: "all",
        similar_images: true,
      }),
    },
  );

  // 3. Robust Error Handling to prevent "Unexpected token U"
  if (!response.ok) {
    const errorText = await response.text(); // Get raw text first
    console.error("Raw API Error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "API Error");
    } catch {
      throw new Error(`Server returned: ${errorText}`);
    }
  }

  const data = await response.json();
  const result = data.result;

  // 4. Safe Data Mapping
  const isHealthy = result.is_healthy?.binary ?? true;
  const bestDisease = result.disease?.suggestions?.[0];
  const treatment = bestDisease?.details?.treatment;

  return {
    plantName: result.classification?.suggestions?.[0]?.name || "Unknown Plant",
    diseaseName: isHealthy
      ? "Healthy"
      : bestDisease?.name || "Unidentified issue",
    status: (isHealthy ? "healthy" : "action_required") as
      | "healthy"
      | "action_required",
    confidence: Math.round(
      (result.classification?.suggestions?.[0]?.probability || 0) * 100,
    ),
    organicTreatment: treatment?.biological || [
      "Prune affected areas",
      "Ensure proper sunlight",
    ],
    chemicalTreatment: treatment?.chemical || [
      "Apply general fungicide if symptoms persist",
    ],
    preventionTips: treatment?.prevention || [
      "Avoid overhead watering",
      "Maintain plant spacing",
    ],
  };
};
