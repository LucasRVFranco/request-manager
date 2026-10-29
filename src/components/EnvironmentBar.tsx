import { useState } from "react";
import { useAppDispatch, useAppState } from "../state/AppState";
import { EnvironmentManager } from "./EnvironmentManager";

export function EnvironmentBar() {
  const { environments, activeEnvironmentId } = useAppState();
  const dispatch = useAppDispatch();
  const [managerOpen, setManagerOpen] = useState(false);

  return (
    <div className="environment-bar">
      <select
        value={activeEnvironmentId ?? ""}
        onChange={(e) =>
          dispatch({ type: "SET_ACTIVE_ENVIRONMENT", environmentId: e.currentTarget.value || null })
        }
      >
        <option value="">Sem ambiente</option>
        {environments.map((env) => (
          <option key={env.id} value={env.id}>
            {env.name}
          </option>
        ))}
      </select>
      <button className="icon-button" title="Gerenciar ambientes" onClick={() => setManagerOpen(true)}>
        ⚙
      </button>
      {managerOpen && <EnvironmentManager onClose={() => setManagerOpen(false)} />}
    </div>
  );
}
