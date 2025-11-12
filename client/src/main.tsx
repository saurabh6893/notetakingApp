import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import ErrorBoundary from "./Components/ErrorBoundary";
import { RateLimitAlert } from "./Components/RateLimitAlert";
import { SWRConfig } from "swr";
import { localStorageProvider } from "./lib/localStorageProvider";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SWRConfig value={{ provider: localStorageProvider }}>
        <RateLimitAlert />
        <App />
      </SWRConfig>
    </ErrorBoundary>
  </StrictMode>,
);
