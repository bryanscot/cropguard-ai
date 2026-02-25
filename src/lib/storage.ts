// Define the interface locally to avoid the import conflict you had
export interface ScanResult {
  id: string;
  date: string;
  imageUrl: string;
  plantName: string;
  scientificName?: string; // Add this line (marked optional with ?)
  diseaseName: string;
  status: "healthy" | "action_required";
  confidence: number;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
}

const STORAGE_KEY = "cropguard-scans";

/**
 * Retrieves scans from Local Storage.
 */
export function getStoredScans(): ScanResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from Local Storage:", error);
    return [];
  }
}

/**
 * Saves a new scan. To prevent QuotaExceededError, we limit
 * the history to the last 20 scans.
 */
export function saveScan(scan: ScanResult): void {
  try {
    const scans = getStoredScans();
    // Add new scan to the start
    const updatedScans = [scan, ...scans];

    // PERMANENT FIX: Keep only the last 20 scans to save space
    const limitedScans = updatedScans.slice(0, 20);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedScans));
  } catch (error) {
    console.error("LocalStorage is full! Clear your history.", error);
    // Fallback: If it still fails, try clearing old data automatically
    const scans = getStoredScans();
    if (scans.length > 5) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans.slice(0, 5)));
    }
  }
}

/**
 * Clears all scan history.
 */
export function clearScans(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Deletes a single scan by ID.
 */
export function deleteScan(id: string): void {
  const scans = getStoredScans();
  const filtered = scans.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
