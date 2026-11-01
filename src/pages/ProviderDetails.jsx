import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Thumb from "../components/Thumb.jsx";
import { getAvailability, getInstructors, getProvider } from "../services/providers.js";
import { stars } from "../utils.js";

const tabs = ["Services", "Schedule", "Instructors", "Reviews", "Map"];

export default function ProviderDetails() {
  const { id } = useParams();
  const [tab, setTab] = useState("Services");
  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState("loading");
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setStatus("loading");
      setProvider(null);
      try {
        const [data, availability, instructors] = await Promise.all([
          getProvider(id, controller.signal),
          getAvailability(id, controller.signal),
          getInstructors(id, controller.signal),
        ]);
        if (!controller.signal.aborted) {
          setProvider({ ...data, availability, instructors });
          setStatus("success");
        }
      } catch (error) {
        if (!controller.signal.aborted) setStatus(error.message.includes("404") ? "not-found" : "error");
      }
    }
    load();
    return () => controller.abort();
  }, [id, request]);

  if (status === "loading") return <p role="status">Loading provider details…</p>;
  if (status === "error") return <div className="status-message" role="alert"><p>Could not load this provider. Check your connection and try again.</p><button className="btn" type="button" onClick={() => setRequest((value) => value + 1)}>Retry</button></div>;
  if (status === "not-found") return <><h1>Provider not found</h1><p className="muted">This provider does not exist.</p><Link to="/search" className="btn">Back to search</Link></>;

  const location = provider.location || {};
  const services = provider.services || [];
  const availability = provider.availability || [];
  const instructors = provider.instructors || [];
  const reviews = provider.reviews || [];
  const hasMap = Number.isFinite(location.latitude) && Number.isFinite(location.longitude);
  const delta = 0.01;
  const mapSrc = hasMap ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - delta},${location.latitude - delta},${location.longitude + delta},${location.latitude + delta}&layer=mapnik&marker=${location.latitude},${location.longitude}` : "";

  return (
    <>
      <section className="profile-head">
        <Thumb name={provider.name} size="xl" />
        <div className="profile-summary">
          <span className="eyebrow">SWIMMING PROVIDER</span>
          <h1>{provider.name}</h1>
          <p className="provider-meta"><span className="rating"><span className="stars">{stars(provider.rating)}</span> {provider.rating}</span><span>{location.area}, {location.city}</span></p>
          <p>{provider.description}</p>
          {provider.home_visit && <p className="detail-chip">Home visits available</p>}
          <div className="contact-links"><a href={`tel:${provider.phone}`}>{provider.phone}</a><a href={`mailto:${provider.email}`}>{provider.email}</a></div>
        </div>
      </section>

      <div className="tabs" role="tablist" aria-label="Provider information">
        {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "tab on" : "tab"} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      <div className="panel">
        {tab === "Services" && (services.length ? <ul className="rows">
          {services.map((service) => <li key={service.id}><span>{service.name} · {service.duration_minutes} min</span><span>AED {service.price}</span></li>)}
        </ul> : <p className="muted">No services listed yet.</p>)}
        {tab === "Schedule" && (availability.length ? <ul className="rows">
          {availability.map((day) => <li key={day.id}><span>{day.day}</span><span>{day.times.join(", ")}</span></li>)}
        </ul> : <p className="muted">No schedule listed yet.</p>)}
        {tab === "Instructors" && (instructors.length ? <ul className="rows">
          {instructors.map((instructor) => <li key={instructor.id}><span>{instructor.name} · {instructor.specialties.join(", ")}</span><span>{instructor.experience_years} years experience</span></li>)}
        </ul> : <p className="muted">No instructors listed yet.</p>)}
        {tab === "Reviews" && (reviews.length ? <ul className="rows">
          {reviews.map((review) => <li key={review.id}><span>{review.text}</span><span className="muted">{review.author} · {review.rating}/5</span></li>)}
        </ul> : <p className="muted">No reviews listed yet.</p>)}
        {tab === "Map" && (hasMap ? <iframe className="map" title={`Map of ${provider.name}`} src={mapSrc} loading="lazy" /> : <p className="muted">Map location unavailable.</p>)}
      </div>
    </>
  );
}
