import { load, type Store } from "@tauri-apps/plugin-store";
import type { Collection, Environment, RequestItem } from "../types";

const STORE_FILE = "data.json";

let storePromise: Promise<Store> | null = null;

function getStore(): Promise<Store> {
  if (!storePromise) storePromise = load(STORE_FILE, { autoSave: false });
  return storePromise;
}

export interface PersistedData {
  collections: Collection[];
  requests: RequestItem[];
  environments: Environment[];
  activeEnvironmentId: string | null;
}

export async function loadPersisted(): Promise<PersistedData | null> {
  const store = await getStore();
  const collections = await store.get<Collection[]>("collections");
  const requests = await store.get<RequestItem[]>("requests");
  if (!collections || !requests) return null;
  const environments = (await store.get<Environment[]>("environments")) ?? [];
  const activeEnvironmentId = (await store.get<string | null>("activeEnvironmentId")) ?? null;
  return { collections, requests, environments, activeEnvironmentId };
}

export async function savePersisted(data: PersistedData): Promise<void> {
  const store = await getStore();
  await store.set("collections", data.collections);
  await store.set("requests", data.requests);
  await store.set("environments", data.environments);
  await store.set("activeEnvironmentId", data.activeEnvironmentId);
  await store.save();
}
