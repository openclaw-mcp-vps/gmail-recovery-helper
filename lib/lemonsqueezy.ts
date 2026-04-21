import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const purchaseFile = path.join(dataDir, "purchases.json");

export interface PurchaseRecord {
  sessionId: string;
  email: string;
  amountTotal: number;
  currency: string;
  status: "paid" | "pending";
  createdAt: string;
  updatedAt: string;
}

export function initLemonSqueezy(apiKey: string) {
  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("LemonSqueezy SDK error", error);
    }
  });
}

async function ensurePurchaseStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(purchaseFile, "utf8");
  } catch {
    await writeFile(purchaseFile, "[]", "utf8");
  }
}

export async function readPurchaseRecords(): Promise<PurchaseRecord[]> {
  await ensurePurchaseStore();
  const raw = await readFile(purchaseFile, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PurchaseRecord[]) : [];
  } catch {
    return [];
  }
}

export async function upsertPurchaseRecord(record: PurchaseRecord): Promise<void> {
  const records = await readPurchaseRecords();
  const existingIndex = records.findIndex((existing) => existing.sessionId === record.sessionId);

  if (existingIndex >= 0) {
    records[existingIndex] = {
      ...records[existingIndex],
      ...record,
      updatedAt: new Date().toISOString()
    };
  } else {
    records.push({
      ...record,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  await writeFile(purchaseFile, JSON.stringify(records, null, 2), "utf8");
}

export async function findPurchaseBySessionId(sessionId: string): Promise<PurchaseRecord | undefined> {
  const records = await readPurchaseRecords();
  return records.find((record) => record.sessionId === sessionId && record.status === "paid");
}
