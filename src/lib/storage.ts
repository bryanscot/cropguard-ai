// src/lib/storage.ts
// IndexedDB implementation — replaces LocalStorage
// Capacity: ~50% of device free disk space vs localStorage's 5MB cap

import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface ScanResult {
  id: string;
  date: string;
  imageUrl: string;
  plantName: string;
  scientificName?: string;
  diseaseName: string;
  status: "healthy" | "action_required";
  confidence: number;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
}

interface CropGuardDB extends DBSchema {
  scans: {
    key: string;
    value: ScanResult;
    indexes: {
      "by-date": string;
      "by-status": string;
    };
  };
}

const DB_NAME = "cropguard-db";
const DB_VERSION = 1;
const STORE = "scans";

// Open (or create) the database
async function getDB(): Promise<IDBPDatabase<CropGuardDB>> {
  return openDB<CropGuardDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("by-date", "date", { unique: false });
      store.createIndex("by-status", "status", { unique: false });
    },
  });
}

/**
 * Save a new scan to IndexedDB.
 * No arbitrary limit — stores as many as the device allows.
 */
export async function saveScan(scan: ScanResult): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE, scan);
  } catch (error) {
    console.error("IndexedDB save failed:", error);
  }
}

/**
 * Get all scans, sorted newest first.
 */
export async function getStoredScans(): Promise<ScanResult[]> {
  try {
    const db = await getDB();
    const all = await db.getAll(STORE);
    // Sort by date descending (newest first)
    return all.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("IndexedDB read failed:", error);
    return [];
  }
}

/**
 * Delete a single scan by ID.
 */
export async function deleteScan(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE, id);
  } catch (error) {
    console.error("IndexedDB delete failed:", error);
  }
}

/**
 * Clear all scans.
 */
export async function clearScans(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE);
  } catch (error) {
    console.error("IndexedDB clear failed:", error);
  }
}

/**
 * Get total scan count.
 */
export async function getScanCount(): Promise<number> {
  try {
    const db = await getDB();
    return await db.count(STORE);
  } catch (error) {
    return 0;
  }
}
