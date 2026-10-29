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
          <div className="collection-header">
            <span>{collection.name}</span>
            <button
              className="icon-button"
              title="Nova request"
              onClick={() => dispatch({ type: "ADD_REQUEST", collectionId: collection.id })}
            >
              +
            </button>
          </div>
          <ul className="request-list">
            {requests
              .filter((r) => r.collectionId === collection.id)
              .map((request) => (
                <li
                  key={request.id}
                  className="request-list-item"
                  onClick={() => dispatch({ type: "OPEN_REQUEST", requestId: request.id })}
                >
                  <span className={`method-tag method-${request.method.toLowerCase()}`}>{request.method}</span>
                  <span className="request-name">{request.name}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
