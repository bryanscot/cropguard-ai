// src/lib/plantid-service.ts
const API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY;
const API_URL = "https://api.plant.id/v3/identification";

export const analyzeWithPlantId = async (file: File) => {
  // 1. Get current language from storage to localize API results
  const currentLang = localStorage.getItem("app-language") || "en";

  // 2. Clean Base64 Conversion
  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      // Remove the "data:image/jpeg;base64," prefix strictly
      resolve(res.replace(/^data:image\/\w+;base64,/, ""));
    };
    reader.readAsDataURL(file);
  });

  // 3. Optimized Request Body with Dynamic Language
  const response = await fetch(
    `${API_URL}?language=${currentLang}&details=common_names,description,treatment`,
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

  // 4. Robust Error Handling
  if (!response.ok) {
    const errorText = await response.text();
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

  // 5. Extraction Logic for Names
  const bestSuggestion = result.classification?.suggestions?.[0];
  const commonName = bestSuggestion?.details?.common_names?.[0];
  const scientificName = bestSuggestion?.name;

  // 6. Safe Data Mapping
  const isHealthy = result.is_healthy?.binary ?? true;
  const bestDisease = result.disease?.suggestions?.[0];
  const treatment = bestDisease?.details?.treatment;

  return {
    // Priority: Common Name -> Scientific Name -> Unknown
    plantName: commonName || scientificName || "Unknown Plant",
    
    // Store the raw scientific name for the sub-header
    scientificName: scientificName || "",

    diseaseName: isHealthy
      ? "Healthy"
      : bestDisease?.name || "Unidentified issue",
    
    status: (isHealthy ? "healthy" : "action_required") as
      | "healthy"
      | "action_required",
      
    confidence: Math.round(
      (bestSuggestion?.probability || 0) * 100,
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