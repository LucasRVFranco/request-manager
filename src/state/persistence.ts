import { load, type Store } from "@tauri-apps/plugin-store";
import type { Collection, RequestItem } from "../types";

const STORE_FILE = "data.json";

let storePromise: Promise<Store> | null = null;

function getStore(): Promise<Store> {
  if (!storePromise) storePromise = load(STORE_FILE, { autoSave: false });
  return storePromise;
}

export interface PersistedData {
  collections: Collection[];
  requests: RequestItem[];
}

export async function loadPersisted(): Promise<PersistedData | null> {
  const store = await getStore();
  const collections = await store.get<Collection[]>("collections");
  const requests = await store.get<RequestItem[]>("requests");
  if (!collections || !requests) return null;
  return { collections, requests };
}

export async function savePersisted(data: PersistedData): Promise<void> {
  const store = await getStore();
  await store.set("collections", data.collections);
  await store.set("requests", data.requests);
  await store.save();
}
