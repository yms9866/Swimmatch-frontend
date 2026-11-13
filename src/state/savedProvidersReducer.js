export const STORAGE_KEY = "swimmatch.savedProviders";

export function initializeSavedProviders(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const savedProviders = JSON.parse(raw);
    if (!Array.isArray(savedProviders) || savedProviders.some((id) => typeof id !== "string" && typeof id !== "number")) return fallback;
    return [...new Set(savedProviders)];
  } catch {
    return fallback;
  }
}

export function savedProvidersReducer(state, action) {
  switch (action.type) {
    case "provider/toggled":
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    default:
      return state;
  }
}
