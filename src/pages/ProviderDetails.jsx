import { useState } from "react";
import { useLoaderData } from "react-router";
import Thumb from "../components/Thumb.jsx";
import { getAvailability, getInstructors, getProvider } from "../services/providers.js";
import { stars } from "../utils.js";

const tabs = ["Services", "Schedule", "Instructors", "Reviews", "Map"];

export default function ProviderDetails() {
  const [tab, setTab] = useState("Services");
  const provider = useLoaderData();

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

export async function providerDetailsLoader({ request, params }) {
  let provider;
  try {
    provider = await getProvider(params.id, request.signal);
  } catch (error) {
    if (error.status === 404) throw new Response("Provider not found", { status: 404 });
    throw error;
  }
  const [availability, instructors] = await Promise.all([
    getAvailability(params.id, request.signal),
    getInstructors(params.id, request.signal),
  ]);
  return { ...provider, availability, instructors };
}
