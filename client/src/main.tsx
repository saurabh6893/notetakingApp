import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TaskProvider } from "./context/TaskContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>,
);
