import type { HttpMethod, KeyValueRow, RequestItem, RequestEditorTab } from "../types";
import { useAppDispatch, useAppState } from "../state/AppState";
import { interpolate } from "../state/interpolate";
import { KeyValueTable } from "./KeyValueTable";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function buildUrl(request: RequestItem, variables: KeyValueRow[]): string {
  const url = interpolate(request.url, variables);
  const enabledParams = request.params.filter((p) => p.enabled && p.key);
  if (enabledParams.length === 0) return url;
  try {
    const parsed = new URL(url);
    for (const p of enabledParams) parsed.searchParams.set(p.key, interpolate(p.value, variables));
    return parsed.toString();
  } catch {
    return url;
  }
}

async function sendRequest(
  request: RequestItem,
  variables: KeyValueRow[],
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  dispatch({ type: "SET_RESPONSE", requestId: request.id, response: { status: "loading" } });
  const started = performance.now();
  try {
    const headers: Record<string, string> = {};
    for (const h of request.headers)
      if (h.enabled && h.key) headers[interpolate(h.key, variables)] = interpolate(h.value, variables);

    const hasBody = !["GET", "HEAD"].includes(request.method);
    const res = await fetch(buildUrl(request, variables), {
      method: request.method,
      headers,
      body: hasBody && request.body ? interpolate(request.body, variables) : undefined,
    });
    const text = await res.text();
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => (responseHeaders[key] = value));

    dispatch({
      type: "SET_RESPONSE",
      requestId: request.id,
      response: {
        status: "success",
        httpStatus: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: text,
        timeMs: Math.round(performance.now() - started),
        sizeBytes: new TextEncoder().encode(text).length,
      },
    });
  } catch (err) {
    dispatch({
      type: "SET_RESPONSE",
      requestId: request.id,
      response: { status: "error", message: err instanceof Error ? err.message : String(err) },
    });
  }
}

export function RequestEditor({ request }: { request: RequestItem }) {
  const { activeEditorTab, environments, activeEnvironmentId } = useAppState();
  const dispatch = useAppDispatch();
  const activeVariables = environments.find((e) => e.id === activeEnvironmentId)?.variables ?? [];

  function patch(fields: Partial<RequestItem>) {
    dispatch({ type: "UPDATE_REQUEST", requestId: request.id, patch: fields });
  }

  const tabs: { id: RequestEditorTab; label: string }[] = [
    { id: "params", label: "Params" },
    { id: "headers", label: "Headers" },
    { id: "body", label: "Body" },
  ];

  return (
    <div className="request-editor">
      <div className="request-line">
        <select value={request.method} onChange={(e) => patch({ method: e.currentTarget.value as HttpMethod })}>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          className="url-input"
          placeholder="https://api.exemplo.com/recurso"
          value={request.url}
          onChange={(e) => patch({ url: e.currentTarget.value })}
        />
        <button className="send-button" onClick={() => sendRequest(request, activeVariables, dispatch)}>
          Enviar
        </button>
      </div>

      <div className="editor-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`editor-tab ${activeEditorTab === tab.id ? "editor-tab-active" : ""}`}
            onClick={() => dispatch({ type: "SET_EDITOR_TAB", tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="editor-tab-content">
        {activeEditorTab === "params" && (
          <KeyValueTable rows={request.params} onChange={(rows) => patch({ params: rows })} />
        )}
        {activeEditorTab === "headers" && (
          <KeyValueTable rows={request.headers} onChange={(rows) => patch({ headers: rows })} />
        )}
        {activeEditorTab === "body" && (
          <textarea
            className="body-input"
            placeholder="JSON, texto, etc."
            value={request.body}
            onChange={(e) => patch({ body: e.currentTarget.value })}
          />
        )}
      </div>
    </div>
  );
}
