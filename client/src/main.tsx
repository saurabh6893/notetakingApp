import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import TaskProvidert from "./context/TaskContext.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvidert>
      <App />
    </TaskProvidert>
  </StrictMode>,
);
