import { ScanResult } from "@/types/scan";

export const mockScans: ScanResult[] = [
  {
    id: "1",
    plantName: "Tomato",
    diseaseName: "Early Blight",
    confidence: 87,
    status: "action_required",
    date: "2026-02-23",
    imageUrl: "",
    organicTreatment: [
      "Remove affected leaves immediately",
      "Apply neem oil spray (2-3 tablespoons per gallon of water)",
      "Use copper-based fungicide spray weekly",
      "Mulch around plants to prevent soil splash",
    ],
    chemicalTreatment: [
      "Apply Chlorothalonil (Daconil) every 7-10 days",
      "Use Mancozeb fungicide as preventive spray",
      "Apply Azoxystrobin for active infections",
    ],
    preventionTips: [
      "Rotate crops every 2-3 years",
      "Water at the base, avoid wetting leaves",
      "Ensure proper plant spacing for air circulation",
      "Remove plant debris at end of season",
      "Use disease-resistant varieties",
    ],
  },
  {
    id: "2",
    plantName: "Rice",
    diseaseName: "Healthy",
    confidence: 98,
    status: "healthy",
    date: "2026-02-22",
    imageUrl: "",
    organicTreatment: [],
    chemicalTreatment: [],
    preventionTips: [
      "Continue regular watering schedule",
      "Monitor for pests weekly",
      "Maintain soil nutrient levels",
    ],
  },
  {
    id: "3",
    plantName: "Wheat",
    diseaseName: "Leaf Rust",
    confidence: 72,
    status: "action_required",
    date: "2026-02-20",
    imageUrl: "",
    organicTreatment: [
      "Apply sulfur-based fungicide",
      "Remove and destroy infected leaves",
      "Improve air circulation between plants",
    ],
    chemicalTreatment: [
      "Apply Propiconazole (Tilt) at recommended rates",
      "Use Tebuconazole as foliar spray",
    ],
    preventionTips: [
      "Plant rust-resistant varieties",
      "Avoid excessive nitrogen fertilization",
      "Scout fields regularly during growing season",
    ],
  },
];

export function simulateAnalysis(): Promise<ScanResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseases = [
        { name: "Powdery Mildew", plant: "Cucumber", confidence: 91 },
        { name: "Bacterial Wilt", plant: "Pepper", confidence: 78 },
        { name: "Healthy", plant: "Corn", confidence: 95 },
        { name: "Late Blight", plant: "Potato", confidence: 84 },
      ];
      const pick = diseases[Math.floor(Math.random() * diseases.length)];
      const isHealthy = pick.name === "Healthy";

      resolve({
        id: Date.now().toString(),
        plantName: pick.plant,
        diseaseName: pick.name,
        confidence: pick.confidence,
        status: isHealthy ? "healthy" : "action_required",
        date: new Date().toISOString().split("T")[0],
        imageUrl: "",
        organicTreatment: isHealthy
          ? []
          : [
              "Apply neem oil solution weekly",
              "Use compost tea as foliar spray",
              "Introduce beneficial insects",
            ],
        chemicalTreatment: isHealthy
          ? []
          : [
              "Apply systemic fungicide as directed",
              "Use copper hydroxide spray",
            ],
        preventionTips: [
          "Maintain proper spacing between plants",
          "Ensure adequate drainage",
          "Rotate crops annually",
          "Monitor regularly for early signs",
        ],
      });
    }, 3000);
  });
}
