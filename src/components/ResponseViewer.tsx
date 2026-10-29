import type { ResponseState } from "../types";

export function ResponseViewer({ response }: { response: ResponseState }) {
  if (response.status === "idle") {
    return <div className="response-viewer response-empty">Envie a request para ver a resposta aqui.</div>;
  }

  if (response.status === "loading") {
    return <div className="response-viewer response-empty">Enviando...</div>;
  }

  if (response.status === "error") {
    return <div className="response-viewer response-error">Erro: {response.message}</div>;
  }

  const statusClass = response.httpStatus >= 400 ? "status-error" : response.httpStatus >= 300 ? "status-warn" : "status-ok";

  return (
    <div className="response-viewer">
      <div className="response-meta">
        <span className={`status-badge ${statusClass}`}>
          {response.httpStatus} {response.statusText}
        </span>
        <span>{response.timeMs} ms</span>
        <span>{response.sizeBytes} bytes</span>
      </div>
      <pre className="response-body">{response.body}</pre>
    </div>
  );
}
