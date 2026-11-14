import { useReducer } from "react";
import { useBookings } from "../context/BookingContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

function todayValue() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function initialValues(profile) {
  return { name: profile.name, email: profile.email, provider_id: "", service_id: "", date: "", time: "", place: "facility", notes: "" };
}

function validate(values, providers) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter the swimmer’s name.";
  else if (values.name.trim().length < 2) errors.name = "Enter a name with at least 2 characters.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email, such as name@example.com.";

  const provider = providers.find((item) => String(item.id) === values.provider_id);
  if (!values.provider_id) errors.provider_id = "Choose a swimming provider.";
  else if (!provider) errors.provider_id = "Choose a provider from the list.";

  const service = provider?.services.find((item) => String(item.id) === values.service_id);
  if (!values.service_id) errors.service_id = "Choose a lesson from the list.";
  else if (!service) errors.service_id = "Choose a lesson offered by the selected provider.";

  if (!values.date) errors.date = "Choose a requested lesson date.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || values.date < todayValue()) errors.date = "Choose today or a future date.";
  else {
    const [year, month, day] = values.date.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) errors.date = "Choose a valid calendar date.";
  }
  if (!TIMES.includes(values.time)) errors.time = "Choose a lesson time from the list.";
  if (values.place === "home" && !provider?.home_visit) errors.place = "Choose a provider that offers home visits, or select facility.";
  if (values.place !== "home" && values.place !== "facility") errors.place = "Choose home visit or provider facility.";
  if (values.notes.length > 300) errors.notes = "Keep your note to 300 characters or fewer.";
  return errors;
}

function bookingFormReducer(state, action) {
  switch (action.type) {
    case "changed":
      return { ...state, values: action.values, errors: action.errors, notice: "" };
    case "invalid":
      return { ...state, errors: action.errors, submitted: true, notice: "" };
    case "created":
      return { values: action.values, errors: {}, submitted: false, notice: action.notice };
    default:
      return state;
  }
}

function newBookingId() {
  return globalThis.crypto?.randomUUID?.() || `request-${Date.now()}`;
}

export default function BookingForm({ providers }) {
  const { state: profileState } = useProfile();
  const { dispatch: dispatchBooking } = useBookings();
  const [state, dispatch] = useReducer(bookingFormReducer, profileState.profile, (profile) => ({
    values: initialValues(profile), errors: {}, submitted: false, notice: "",
  }));
  const { values, errors } = state;
  const selectedProvider = providers.find((provider) => String(provider.id) === values.provider_id);
  const services = selectedProvider?.services || [];
  const error = (field) => errors[field];

  const change = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    if (name === "provider_id") {
      nextValues.service_id = "";
      const nextProvider = providers.find((provider) => String(provider.id) === value);
      if (!nextProvider?.home_visit) nextValues.place = "facility";
    }
    dispatch({ type: "changed", values: nextValues, errors: state.submitted ? validate(nextValues, providers) : errors });
  };

  const submit = (event) => {
    event.preventDefault();
    const errors = validate(values, providers);
    if (Object.keys(errors).length) {
      dispatch({ type: "invalid", errors });
      return;
    }

    const provider = providers.find((item) => String(item.id) === values.provider_id);
    const service = provider.services.find((item) => String(item.id) === values.service_id);
    dispatchBooking({ type: "booking/requested", booking: {
      id: newBookingId(),
      provider_id: provider.id,
      provider_name: provider.name,
      service_name: service.name,
      date: values.date,
      time: values.time,
      place: values.place === "home" ? "Home visit" : "Provider facility",
      status: "pending",
    } });
    dispatch({ type: "created", values: initialValues(profileState.profile), notice: "Added to your bookings for this session." });
  };

  return <form className="profile-form booking-form" onSubmit={submit} noValidate>
    <div className="form-intro"><div><h2>Request a lesson</h2><p className="muted">Choose a provider, service, date, and time.</p></div></div>
    <div className="profile-fields">
      <label htmlFor="booking-name">Swimmer’s name<input id="booking-name" name="name" autoComplete="name" value={values.name} onChange={change} required aria-invalid={Boolean(error("name"))} aria-describedby={error("name") ? "booking-error-name" : undefined} />{error("name") && <span className="field-error" id="booking-error-name">{error("name")}</span>}</label>
      <label htmlFor="booking-email">Email address<input id="booking-email" name="email" type="email" autoComplete="email" value={values.email} onChange={change} required aria-invalid={Boolean(error("email"))} aria-describedby={error("email") ? "booking-error-email" : undefined} />{error("email") && <span className="field-error" id="booking-error-email">{error("email")}</span>}</label>
      <label htmlFor="booking-provider">Provider<select id="booking-provider" name="provider_id" value={values.provider_id} onChange={change} required aria-invalid={Boolean(error("provider_id"))} aria-describedby={error("provider_id") ? "booking-error-provider" : undefined}><option value="">Choose a provider</option>{providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select>{error("provider_id") && <span className="field-error" id="booking-error-provider">{error("provider_id")}</span>}</label>
      <label htmlFor="booking-service">Lesson<select id="booking-service" name="service_id" value={values.service_id} onChange={change} required disabled={!selectedProvider} aria-invalid={Boolean(error("service_id"))} aria-describedby={error("service_id") ? "booking-error-service" : undefined}><option value="">{selectedProvider ? "Choose a lesson" : "Choose a provider first"}</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name} · AED {service.price}</option>)}</select>{error("service_id") && <span className="field-error" id="booking-error-service">{error("service_id")}</span>}</label>
      <label htmlFor="booking-date">Requested date<input id="booking-date" name="date" type="date" min={todayValue()} value={values.date} onChange={change} required aria-invalid={Boolean(error("date"))} aria-describedby={error("date") ? "booking-error-date" : undefined} />{error("date") && <span className="field-error" id="booking-error-date">{error("date")}</span>}</label>
      <label htmlFor="booking-time">Requested time<select id="booking-time" name="time" value={values.time} onChange={change} required aria-invalid={Boolean(error("time"))} aria-describedby={error("time") ? "booking-error-time" : undefined}><option value="">Choose a time</option>{TIMES.map((time) => <option key={time} value={time}>{time}</option>)}</select>{error("time") && <span className="field-error" id="booking-error-time">{error("time")}</span>}</label>
      <label htmlFor="booking-place">Lesson location<select id="booking-place" name="place" value={values.place} onChange={change} required aria-invalid={Boolean(error("place"))} aria-describedby={error("place") ? "booking-error-place" : undefined}><option value="facility">Provider facility</option>{selectedProvider?.home_visit && <option value="home">Home visit</option>}</select>{error("place") && <span className="field-error" id="booking-error-place">{error("place")}</span>}</label>
      <label className="booking-notes" htmlFor="booking-notes">Note for the provider (optional)<textarea id="booking-notes" name="notes" value={values.notes} onChange={change} maxLength={301} rows={3} aria-invalid={Boolean(error("notes"))} aria-describedby={error("notes") ? "booking-error-notes" : "booking-notes-count"} />{error("notes") ? <span className="field-error" id="booking-error-notes">{error("notes")}</span> : <span className="muted field-hint" id="booking-notes-count">{values.notes.length}/300 characters</span>}</label>
    </div>
    <div className="form-actions"><button className="btn" type="submit">Add booking request</button>{state.notice && <span className="success-message" role="status">{state.notice}</span>}</div>
  </form>;
}
