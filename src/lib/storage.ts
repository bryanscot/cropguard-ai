import { ScanResult } from "@/types/scan";

const STORAGE_KEY = "cropguard-scans";

export function getStoredScans(): ScanResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveScan(scan: ScanResult): void {
  const scans = getStoredScans();
  scans.unshift(scan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

export function clearScans(): void {
  localStorage.removeItem(STORAGE_KEY);
}
