const emptyProfile = { name: "", email: "", location: "", swimming_level: "", preferred_lessons: [] };
export const PROFILE_STORAGE_KEY = "swimmatch.profile";
const LEGACY_PREFERENCES_KEY = "swimmatch.profilePreferences";
export const SWIMMING_LEVELS = ["Beginner", "Intermediate", "Advanced"];
export const LESSON_PREFERENCES = ["Private lessons", "Group lessons", "Adult lessons", "Children's lessons"];

export const initialProfileState = {
  profile: emptyProfile,
  profileDraft: { ...emptyProfile, preferred_lessons: [] },
  profileErrors: {},
  profileSubmitted: false,
  profileSaved: false,
};

export function initializeProfileState(fallback) {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    if (savedProfile !== null) {
      if (!savedProfile || typeof savedProfile !== "object" ||
        typeof savedProfile.name !== "string" || typeof savedProfile.email !== "string" || typeof savedProfile.location !== "string" ||
        typeof savedProfile.swimming_level !== "string" ||
        (savedProfile.swimming_level !== "" && !SWIMMING_LEVELS.includes(savedProfile.swimming_level)) ||
        !Array.isArray(savedProfile.preferred_lessons) || savedProfile.preferred_lessons.some((item) => !LESSON_PREFERENCES.includes(item))) return fallback;
      return {
        ...fallback,
        profile: { ...fallback.profile, ...savedProfile },
        profileDraft: { ...fallback.profileDraft, ...savedProfile },
      };
    }

    const savedPreferences = JSON.parse(localStorage.getItem(LEGACY_PREFERENCES_KEY));
    if (!savedPreferences || typeof savedPreferences !== "object" || typeof savedPreferences.swimming_level !== "string" ||
      (savedPreferences.swimming_level !== "" && !SWIMMING_LEVELS.includes(savedPreferences.swimming_level)) ||
      !Array.isArray(savedPreferences.preferred_lessons) || savedPreferences.preferred_lessons.some((item) => !LESSON_PREFERENCES.includes(item))) return fallback;
    if (!savedPreferences.swimming_level && savedPreferences.preferred_lessons.length === 0) return fallback;
    const preferences = { swimming_level: savedPreferences.swimming_level, preferred_lessons: savedPreferences.preferred_lessons };
    return {
      ...fallback,
      profile: { ...fallback.profile, ...preferences },
      profileDraft: { ...fallback.profileDraft, ...preferences },
    };
  } catch {
    return fallback;
  }
}

function validateProfile(profile) {
  const errors = {};
  if (!profile.name.trim()) errors.name = "Enter your full name.";
  else if (profile.name.trim().length < 2) errors.name = "Enter a name with at least 2 characters.";
  if (!profile.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) errors.email = "Enter a valid email, such as name@example.com.";
  if (!profile.location.trim()) errors.location = "Enter your city or area.";
  if (!SWIMMING_LEVELS.includes(profile.swimming_level)) errors.swimming_level = "Choose a swimming level from the list.";
  if (!profile.preferred_lessons.length || profile.preferred_lessons.some((item) => !LESSON_PREFERENCES.includes(item))) errors.preferred_lessons = "Choose at least one lesson type from the list.";
  return errors;
}

export function profileReducer(state, action) {
  switch (action.type) {
    case "draft/changed": {
      const profileDraft = { ...state.profileDraft, [action.field]: action.value };
      return {
        ...state,
        profileDraft,
        profileErrors: state.profileSubmitted ? validateProfile(profileDraft) : state.profileErrors,
        profileSaved: false,
      };
    }
    case "form/submitted": {
      const profileErrors = validateProfile(state.profileDraft);
      if (Object.keys(profileErrors).length) return { ...state, profileErrors, profileSubmitted: true, profileSaved: false };
      const profile = {
        ...state.profileDraft,
        name: state.profileDraft.name.trim(),
        email: state.profileDraft.email.trim(),
        location: state.profileDraft.location.trim(),
      };
      return { ...state, profile, profileDraft: profile, profileErrors: {}, profileSubmitted: true, profileSaved: true };
    }
    default:
      return state;
  }
}
