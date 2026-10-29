import { useAppDispatch, useAppState } from "../state/AppState";

export function TabBar() {
  const { openTabIds, activeTabId, requests } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div className="tab-bar">
      {openTabIds.map((id) => {
        const request = requests.find((r) => r.id === id);
        if (!request) return null;
        return (
          <div
            key={id}
            className={`tab ${id === activeTabId ? "tab-active" : ""}`}
            onClick={() => dispatch({ type: "SET_ACTIVE_TAB", requestId: id })}
          >
            <span className={`method-tag method-${request.method.toLowerCase()}`}>{request.method}</span>
            <span className="tab-name">{request.name}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "CLOSE_TAB", requestId: id });
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
