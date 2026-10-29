import { AppStateProvider, useAppState } from "./state/AppState";
import { Sidebar } from "./components/Sidebar";
import { TabBar } from "./components/TabBar";
import { RequestEditor } from "./components/RequestEditor";
import { ResponseViewer } from "./components/ResponseViewer";
import "./App.css";

function Workspace() {
  const { requests, activeTabId, responses } = useAppState();
  const activeRequest = requests.find((r) => r.id === activeTabId);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-pane">
        <TabBar />
        {activeRequest ? (
          <>
            <RequestEditor request={activeRequest} />
            <ResponseViewer response={responses[activeRequest.id] ?? { status: "idle" }} />
          </>
        ) : (
          <div className="no-tab">Abra uma request na sidebar para começar.</div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppStateProvider>
      <Workspace />
    </AppStateProvider>
  );
}

export default App;
