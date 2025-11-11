import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import ErrorBoundary from "./Components/ErrorBoundary";
import { RateLimitAlert } from "./Components/RateLimitAlert";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RateLimitAlert />
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
