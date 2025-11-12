export const localStorageProvider = () => {
  // Restore from localStorage (key must be string)
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem("app-cache") || "[]"),
  );

  // Persist back to localStorage on window unload
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      "app-cache",
      JSON.stringify(Array.from(map.entries())),
    );
  });

  return map;
};
