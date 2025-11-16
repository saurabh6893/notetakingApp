import type { Cache } from "swr";

export const localStorageProvider = (): Cache<unknown> => {
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem("app-cache") || "[]"),
  );

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      "app-cache",
      JSON.stringify(Array.from(map.entries())),
    );
  });

  return map as unknown as Cache<unknown>;
};
