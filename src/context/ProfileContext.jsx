import { createContext, useContext, useEffect, useReducer } from "react";
import { initialProfileState, initializeProfileState, profileReducer, PROFILE_STORAGE_KEY } from "../state/profileReducer.js";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [state, dispatch] = useReducer(profileReducer, initialProfileState, initializeProfileState);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        ...state.profile,
        swimming_level: state.profileDraft.swimming_level,
        preferred_lessons: state.profileDraft.preferred_lessons,
      }));
    } catch {
      // Preferences remain available in memory when storage is unavailable.
    }
  }, [state.profile, state.profileDraft.swimming_level, state.profileDraft.preferred_lessons]);
  return <ProfileContext.Provider value={{ state, dispatch }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
