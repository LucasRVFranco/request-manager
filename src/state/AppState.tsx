import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Collection, KeyValueRow, RequestItem, RequestEditorTab, ResponseState } from "../types";

function newId(): string {
  return crypto.randomUUID();
}

function emptyRow(): KeyValueRow {
  return { id: newId(), key: "", value: "", enabled: true };
}

function seed(): { collections: Collection[]; requests: RequestItem[] } {
  const collectionId = newId();
  const collection: Collection = { id: collectionId, name: "Exemplo" };
  const request: RequestItem = {
    id: newId(),
    collectionId,
    name: "Listar posts",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    params: [emptyRow()],
    headers: [emptyRow()],
    body: "",
  };
  return { collections: [collection], requests: [request] };
}

interface AppStateShape {
  collections: Collection[];
  requests: RequestItem[];
  openTabIds: string[];
  activeTabId: string | null;
  activeEditorTab: RequestEditorTab;
  responses: Record<string, ResponseState>;
}

type Action =
  | { type: "ADD_COLLECTION"; name: string }
  | { type: "ADD_REQUEST"; collectionId: string }
  | { type: "DELETE_REQUEST"; requestId: string }
  | { type: "OPEN_REQUEST"; requestId: string }
  | { type: "CLOSE_TAB"; requestId: string }
  | { type: "SET_ACTIVE_TAB"; requestId: string }
  | { type: "SET_EDITOR_TAB"; tab: RequestEditorTab }
  | { type: "UPDATE_REQUEST"; requestId: string; patch: Partial<RequestItem> }
  | { type: "SET_RESPONSE"; requestId: string; response: ResponseState };

function reducer(state: AppStateShape, action: Action): AppStateShape {
  switch (action.type) {
    case "ADD_COLLECTION": {
      const collection: Collection = { id: newId(), name: action.name };
      return { ...state, collections: [...state.collections, collection] };
    }
    case "ADD_REQUEST": {
      const request: RequestItem = {
        id: newId(),
        collectionId: action.collectionId,
        name: "Nova request",
        method: "GET",
        url: "",
        params: [emptyRow()],
        headers: [emptyRow()],
        body: "",
      };
      return {
        ...state,
        requests: [...state.requests, request],
        openTabIds: [...state.openTabIds, request.id],
        activeTabId: request.id,
      };
    }
    case "DELETE_REQUEST": {
      const requests = state.requests.filter((r) => r.id !== action.requestId);
      const openTabIds = state.openTabIds.filter((id) => id !== action.requestId);
      const activeTabId = state.activeTabId === action.requestId ? openTabIds.at(-1) ?? null : state.activeTabId;
      return { ...state, requests, openTabIds, activeTabId };
    }
    case "OPEN_REQUEST": {
      const openTabIds = state.openTabIds.includes(action.requestId)
        ? state.openTabIds
        : [...state.openTabIds, action.requestId];
      return { ...state, openTabIds, activeTabId: action.requestId };
    }
    case "CLOSE_TAB": {
      const openTabIds = state.openTabIds.filter((id) => id !== action.requestId);
      const activeTabId = state.activeTabId === action.requestId ? openTabIds.at(-1) ?? null : state.activeTabId;
      return { ...state, openTabIds, activeTabId };
    }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTabId: action.requestId };
    case "SET_EDITOR_TAB":
      return { ...state, activeEditorTab: action.tab };
    case "UPDATE_REQUEST": {
      const requests = state.requests.map((r) => (r.id === action.requestId ? { ...r, ...action.patch } : r));
      return { ...state, requests };
    }
    case "SET_RESPONSE":
      return { ...state, responses: { ...state.responses, [action.requestId]: action.response } };
    default:
      return state;
  }
}

function initialState(): AppStateShape {
  const { collections, requests } = seed();
  return {
    collections,
    requests,
    openTabIds: [requests[0].id],
    activeTabId: requests[0].id,
    activeEditorTab: "params",
    responses: {},
  };
}

const StateContext = createContext<AppStateShape | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppStateShape {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export function useAppDispatch(): React.Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used inside AppStateProvider");
  return ctx;
}

export { emptyRow };
