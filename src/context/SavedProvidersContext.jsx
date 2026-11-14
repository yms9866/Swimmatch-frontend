import { createContext, useContext, useEffect, useReducer } from "react";
import { initializeSavedProviders, savedProvidersReducer, STORAGE_KEY } from "../state/savedProvidersReducer.js";

const SavedProvidersContext = createContext(null);

export function SavedProvidersProvider({ children }) {
  const [savedProviders, dispatch] = useReducer(savedProvidersReducer, [], initializeSavedProviders);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProviders));
    } catch {
      // Storage may be disabled or full; saved providers remain available for this session.
    }
  }, [savedProviders]);

  return <SavedProvidersContext.Provider value={{ savedProviders, dispatch }}>{children}</SavedProvidersContext.Provider>;
}

export function useSavedProviders() {
  const context = useContext(SavedProvidersContext);
  if (!context) throw new Error("useSavedProviders must be used inside SavedProvidersProvider");
  return context;
}
