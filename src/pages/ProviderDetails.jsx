import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Thumb from "../components/Thumb.jsx";
import providers from "../data/providers.js";
import { stars } from "../utils.js";

const tabs = [
  { id: 1, name: "Services" },
  { id: 2, name: "Schedule" },
  { id: 3, name: "Reviews" },
  { id: 4, name: "Map" },
];

export default function ProviderDetails() {
  const { id } = useParams();
  const [tab, setTab] = useState("Services");
  const p = providers.find((x) => x.id === Number(id));

  if (!p) {
    return (
      <>
        <h1>Provider not found</h1>
        <p className="muted">This provider doesn't exist or was removed.</p>
        <Link to="/search" className="btn">Back to search</Link>
      </>
    );
  }

  const d = 0.01;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - d},${p.lat - d},${p.lng + d},${p.lat + d}&layer=mapnik&marker=${p.lat},${p.lng}`;

  return (
    <>
      <section className="profile-head">
        <Thumb name={p.name} size="xl" />
        <div>
          <h1>{p.name}</h1>
          <p className="muted"><span className="stars">{stars(p.rating)}</span> {p.rating} ({p.reviews} reviews) · {p.area}, {p.city}</p>
          <p className="muted">{p.levels.join(", ")} · {p.lessonTypes.join(" & ")} · {p.years} yrs experience</p>
          <div className="actions">
            <button className="btn" type="button">Book Now</button>
            <button className="btn btn-outline" type="button">Message Provider</button>
          </div>
        </div>
      </section>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.name} className={tab === t.name ? "tab on" : "tab"} onClick={() => setTab(t.name)}>{t.name}</button>
        ))}
      </div>
      <div className="panel">
        {tab === "Services" && (
          <ul className="rows">
            {p.services.map((s) => (<li key={s.id}><span>{s.name}</span><span>{s.price}</span></li>))}
          </ul>
        )}
        {tab === "Schedule" && (
          <ul className="rows">
            {p.schedule.map((s) => (<li key={s.id}><span>{s.day}</span><span>{s.time}</span></li>))}
          </ul>
        )}
        {tab === "Reviews" && (
          <ul className="rows">
            {p.reviewsList.map((r) => (<li key={r.id}><span>{r.text}</span><span className="muted">{r.author}</span></li>))}
          </ul>
        )}
        {tab === "Map" && <iframe className="map" title={`Map of ${p.name}`} src={mapSrc} loading="lazy" />}
      </div>
    </>
  );
}
