import { promises as fs } from "node:fs";
import path from "node:path";

const STORE_DIR = path.join(process.cwd(), "data", "store");

type WithId = { id: string };

async function ensureStoreDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

async function readCollection<T>(fileName: string): Promise<T[]> {
  const filePath = path.join(STORE_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Serializes writes per file so concurrent requests can't interleave and corrupt the JSON.
const writeQueues = new Map<string, Promise<unknown>>();

async function writeCollection<T>(fileName: string, items: T[]): Promise<void> {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, fileName);
  const previous = writeQueues.get(fileName) ?? Promise.resolve();
  const next = previous.then(() => fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8"));
  writeQueues.set(fileName, next);
  await next;
}

export async function listItems<T>(fileName: string): Promise<T[]> {
  return readCollection<T>(fileName);
}

export async function findItem<T extends WithId>(fileName: string, id: string): Promise<T | null> {
  const items = await readCollection<T>(fileName);
  return items.find((item) => item.id === id) ?? null;
}

export async function createItem<T extends WithId>(fileName: string, item: T): Promise<T> {
  const items = await readCollection<T>(fileName);
  items.push(item);
  await writeCollection(fileName, items);
  return item;
}

export async function updateItem<T extends WithId>(
  fileName: string,
  id: string,
  updater: (existing: T) => T,
): Promise<T | null> {
  const items = await readCollection<T>(fileName);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = updater(items[index]);
  items[index] = updated;
  await writeCollection(fileName, items);
  return updated;
}

export async function deleteItem(fileName: string, id: string): Promise<boolean> {
  const items = await readCollection<WithId>(fileName);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeCollection(fileName, next);
  return true;
}
