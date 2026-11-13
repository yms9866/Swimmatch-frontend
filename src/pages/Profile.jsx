import Thumb from "../components/Thumb.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { LESSON_PREFERENCES, SWIMMING_LEVELS } from "../state/profileReducer.js";

export default function Profile() {
  const { state, dispatch } = useProfile();
  const { profile, profileDraft, profileErrors, profileSaved } = state;
  const change = (event) => dispatch({ type: "draft/changed", field: event.target.name, value: event.target.value });
  const error = (field) => profileErrors[field];

  return <>
    <div className="page-heading"><span className="eyebrow">YOUR SWIMMATCH PROFILE</span><h1>{profile.name ? `Hello, ${profile.name.split(" ")[0]}` : "Set up your swimmer profile"}</h1><p>Your details and lesson preferences help tailor your search across SwimMatch.</p></div>
    <form className="profile-form" onSubmit={(event) => { event.preventDefault(); dispatch({ type: "form/submitted" }); }} noValidate>
      <div className="form-intro"><div><h2>Swimmer details</h2><p className="muted">All fields are needed to save your profile.</p></div>{profile.name && <Thumb name={profile.name} />}</div>
      <div className="profile-fields">
        <label htmlFor="profile-name">Full name<input id="profile-name" name="name" autoComplete="name" value={profileDraft.name} onChange={change} aria-invalid={Boolean(error("name"))} aria-describedby={error("name") ? "error-name" : undefined} />{error("name") && <span className="field-error" id="error-name">{error("name")}</span>}</label>
        <label htmlFor="profile-email">Email address<input id="profile-email" name="email" type="email" autoComplete="email" value={profileDraft.email} onChange={change} aria-invalid={Boolean(error("email"))} aria-describedby={error("email") ? "error-email" : undefined} />{error("email") && <span className="field-error" id="error-email">{error("email")}</span>}</label>
        <label htmlFor="profile-location">City or area<input id="profile-location" name="location" autoComplete="address-level2" value={profileDraft.location} onChange={change} placeholder="e.g. Sharjah" aria-invalid={Boolean(error("location"))} aria-describedby={error("location") ? "error-location" : undefined} />{error("location") && <span className="field-error" id="error-location">{error("location")}</span>}</label>
        <label htmlFor="profile-level">Swimming level<select id="profile-level" name="swimming_level" value={profileDraft.swimming_level} onChange={change} aria-invalid={Boolean(error("swimming_level"))} aria-describedby={error("swimming_level") ? "error-level" : undefined}><option value="">Choose your level</option>{SWIMMING_LEVELS.map((level) => <option key={level}>{level}</option>)}</select>{error("swimming_level") && <span className="field-error" id="error-level">{error("swimming_level")}</span>}</label>
      </div>
      <fieldset className="lesson-preferences" aria-describedby={error("preferred_lessons") ? "error-lessons" : undefined}>
        <legend>Preferred lesson types</legend><p className="muted">Select all that suit you.</p>
        <div className="checkbox-grid">{LESSON_PREFERENCES.map((lesson) => <label className="check-option" key={lesson}><input type="checkbox" name="preferred_lessons" value={lesson} checked={profileDraft.preferred_lessons.includes(lesson)} onChange={(event) => {
          const preferred_lessons = event.target.checked
            ? [...profileDraft.preferred_lessons, lesson]
            : profileDraft.preferred_lessons.filter((item) => item !== lesson);
          dispatch({ type: "draft/changed", field: "preferred_lessons", value: preferred_lessons });
        }} />{lesson}</label>)}</div>
        {error("preferred_lessons") && <span className="field-error" id="error-lessons">{error("preferred_lessons")}</span>}
      </fieldset>
      <div className="form-actions"><button className="btn" type="submit">Save profile</button>{profileSaved && <span className="success-message" role="status">Profile saved. Your details are ready across SwimMatch.</span>}</div>
    </form>
  </>;
}
