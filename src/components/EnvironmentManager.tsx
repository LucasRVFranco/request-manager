import { useState } from "react";
import { useAppDispatch, useAppState } from "../state/AppState";
import { KeyValueTable } from "./KeyValueTable";

export function EnvironmentManager({ onClose }: { onClose: () => void }) {
  const { environments } = useAppState();
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(environments[0]?.id ?? null);

  const selected = environments.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Ambientes</span>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body environment-manager">
          <div className="environment-list">
            <ul>
              {environments.map((env) => (
                <li
                  key={env.id}
                  className={env.id === selectedId ? "environment-list-item-active" : ""}
                  onClick={() => setSelectedId(env.id)}
                  onDoubleClick={() => {
                    const name = window.prompt("Renomear ambiente", env.name);
                    if (name) dispatch({ type: "RENAME_ENVIRONMENT", environmentId: env.id, name });
                  }}
                >
                  <span>{env.name}</span>
                  <button
                    className="icon-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Apagar o ambiente "${env.name}"?`)) {
                        dispatch({ type: "DELETE_ENVIRONMENT", environmentId: env.id });
                        if (selectedId === env.id) setSelectedId(null);
                      }
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="icon-button"
              onClick={() => {
                const name = window.prompt("Nome do ambiente");
                if (name) dispatch({ type: "ADD_ENVIRONMENT", name });
              }}
            >
              + Novo ambiente
            </button>
          </div>
          <div className="environment-variables">
            {selected ? (
              <KeyValueTable
                rows={selected.variables}
                onChange={(rows) =>
                  dispatch({ type: "SET_ENVIRONMENT_VARIABLES", environmentId: selected.id, variables: rows })
                }
              />
            ) : (
              <p className="response-empty">Selecione ou crie um ambiente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
