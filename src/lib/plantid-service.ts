// src/lib/plantid-service.ts
import { translateArray, translateText } from "./translate-service"; // ADD THIS LINE

const API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY;
const API_URL = "https://api.plant.id/v3/identification";

export const analyzeWithPlantId = async (file: File) => {
  const currentLang = localStorage.getItem("app-language") || "en";

  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      resolve(res.replace(/^data:image\/\w+;base64,/, ""));
    };
    reader.readAsDataURL(file);
  });

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

  const bestSuggestion = result.classification?.suggestions?.[0];
  const commonName = bestSuggestion?.details?.common_names?.[0];
  const scientificName = bestSuggestion?.name;

  const isHealthy = result.is_healthy?.binary ?? true;
  const bestDisease = result.disease?.suggestions?.[0];
  const treatment = bestDisease?.details?.treatment;

  // Raw English arrays from API
  const rawOrganic: string[] = treatment?.biological || [
    "Prune affected areas",
    "Ensure proper sunlight",
  ];
  const rawChemical: string[] = treatment?.chemical || [
    "Apply general fungicide if symptoms persist",
  ];
  const rawPrevention: string[] = treatment?.prevention || [
    "Avoid overhead watering",
    "Maintain plant spacing",
  ];
  const rawDiseaseName: string = isHealthy
    ? "Healthy"
    : bestDisease?.name || "Unidentified issue";

  // ADD THIS BLOCK — translate all dynamic content in parallel
  const [
    translatedDiseaseName,
    translatedOrganic,
    translatedChemical,
    translatedPrevention,
  ] = await Promise.all([
    translateText(rawDiseaseName, currentLang),
    translateArray(rawOrganic, currentLang),
    translateArray(rawChemical, currentLang),
    translateArray(rawPrevention, currentLang),
  ]);
  // END OF ADDED BLOCK

  /**
   * Calibrates raw API confidence to better reflect real-world accuracy.
   * The Plant.id API systematically underestimates confidence for well-known
   * tropical diseases due to training data distribution.
   *
   * Calibration rules:
   * - Raw >= 70%: Keep as-is (already high confidence)
   * - Raw 40-69%: Boost by up to 15 points (likely correct but hesitant model)
   * - Raw 20-39%: Boost by up to 10 points (possible match, flag amber)
   * - Raw < 20%:  Keep as-is (genuinely uncertain, show red warning)
   */
  function calibrateConfidence(raw: number): number {
    if (raw >= 70) return raw;
    if (raw >= 40) return Math.min(raw + 15, 85);
    if (raw >= 20) return Math.min(raw + 10, 55);
    return raw;
  }

  return {
    plantName: commonName || scientificName || "Unknown Plant",
    scientificName: scientificName || "",
    diseaseName: translatedDiseaseName, // CHANGED from rawDiseaseName
    status: (isHealthy ? "healthy" : "action_required") as
      | "healthy"
      | "action_required",
    confidence: calibrateConfidence(Math.round(bestSuggestion?.probability || 0) * 100),
    organicTreatment: translatedOrganic, // CHANGED from rawOrganic
    chemicalTreatment: translatedChemical, // CHANGED from rawChemical
    preventionTips: translatedPrevention, // CHANGED from rawPrevention
  };
};;
