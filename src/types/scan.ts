export interface ScanResult {
  id: string;
  plantName: string;
  diseaseName: string;
  confidence: number;
  status: "healthy" | "action_required";
  date: string;
  imageUrl: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
}
