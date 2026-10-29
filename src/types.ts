export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface KeyValueRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestItem {
  id: string;
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  body: string;
}

export interface Collection {
  id: string;
  name: string;
}

export type RequestEditorTab = "params" | "headers" | "body";

export type ResponseState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      httpStatus: number;
      statusText: string;
      headers: Record<string, string>;
      body: string;
      timeMs: number;
      sizeBytes: number;
    };
