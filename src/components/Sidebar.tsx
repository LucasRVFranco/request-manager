import { useAppDispatch, useAppState } from "../state/AppState";

export function Sidebar() {
  const { collections, requests } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>Collections</span>
        <button
          className="icon-button"
          title="Nova collection"
          onClick={() => {
            const name = window.prompt("Nome da collection");
            if (name) dispatch({ type: "ADD_COLLECTION", name });
          }}
        >
          +
        </button>
      </div>

      {collections.map((collection) => (
        <div key={collection.id} className="collection">
          <div
            className="collection-header"
            onDoubleClick={() => {
              const name = window.prompt("Renomear collection", collection.name);
              if (name) dispatch({ type: "RENAME_COLLECTION", collectionId: collection.id, name });
            }}
          >
            <span>{collection.name}</span>
            <span className="collection-actions">
              <button
                className="icon-button"
                title="Nova request"
                onClick={() => dispatch({ type: "ADD_REQUEST", collectionId: collection.id })}
              >
                +
              </button>
              <button
                className="icon-button"
                title="Apagar collection"
                onClick={() => {
                  if (window.confirm(`Apagar a collection "${collection.name}" e todas as requests dela?`)) {
                    dispatch({ type: "DELETE_COLLECTION", collectionId: collection.id });
                  }
                }}
              >
                ×
              </button>
            </span>
          </div>
          <ul className="request-list">
            {requests
              .filter((r) => r.collectionId === collection.id)
              .map((request) => (
                <li
                  key={request.id}
                  className="request-list-item"
                  onClick={() => dispatch({ type: "OPEN_REQUEST", requestId: request.id })}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    const name = window.prompt("Renomear request", request.name);
                    if (name) dispatch({ type: "UPDATE_REQUEST", requestId: request.id, patch: { name } });
                  }}
                >
                  <span className={`method-tag method-${request.method.toLowerCase()}`}>{request.method}</span>
                  <span className="request-name">{request.name}</span>
                  <button
                    className="icon-button request-delete"
                    title="Apagar request"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Apagar a request "${request.name}"?`)) {
                        dispatch({ type: "DELETE_REQUEST", requestId: request.id });
                      }
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
