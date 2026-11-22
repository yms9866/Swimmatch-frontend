import { Link, useLoaderData, useSearchParams } from "react-router";
import { getAllInstructors, getProviderSummaries } from "../services/providers.js";
import Thumb from "../components/Thumb.jsx";

async function loadInstructors(signal) {
  const [instructors, providers] = await Promise.all([getAllInstructors(signal), getProviderSummaries(signal)]);
  return {
    instructors,
    providers,
    names: new Map(providers.map((provider) => [provider.id, provider.name])),
  };
}

export default function Instructors() {
  const data = useLoaderData();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const specialty = params.get("specialty") || "";
  const providerId = params.get("provider") || "";
  const minimumExperience = params.get("experience") || "";
  const visibleCount = Math.max(18, Number(params.get("count")) || 18);
  const specialties = [...new Set(data.instructors.flatMap((instructor) => instructor.specialties || []))]
    .sort((a, b) => a.localeCompare(b));
  const matches = data.instructors.filter((instructor) => {
    const provider = data.providers.find((item) => String(item.id) === String(instructor.provider_id));
    const location = `${provider?.location?.city || ""} ${provider?.location?.area || ""}`;
    const text = `${instructor.name} ${(instructor.specialties || []).join(" ")} ${data.names.get(instructor.provider_id) || ""} ${location}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) &&
      (!specialty || (instructor.specialties || []).some((item) => item.toLowerCase() === specialty.toLowerCase())) &&
      (!providerId || String(instructor.provider_id) === providerId) &&
      (!minimumExperience || Number(instructor.experience_years) >= Number(minimumExperience));
  });

  const updateParam = (key, value) => setParams((current) => {
    const next = new URLSearchParams(current);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "count") next.delete("count");
    return next;
  }, { replace: true });

  return <>
    <div className="page-heading"><span className="eyebrow">MEET THE COACHES</span><h1>Swimming instructors</h1><p>Find experienced instructors and explore their specialties.</p></div>
    <div className="directory-tools catalog-tools instructor-tools">
      <label>Search instructors<input value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="Name, provider, specialty, or city" /></label>
      <label>Specialty<select value={specialty} onChange={(event) => updateParam("specialty", event.target.value)}><option value="">Any specialty</option>{specialties.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label>Provider<select value={providerId} onChange={(event) => updateParam("provider", event.target.value)}><option value="">Any provider</option>{data.providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label>
      <label>Experience<select value={minimumExperience} onChange={(event) => updateParam("experience", event.target.value)}><option value="">Any experience</option><option value="3">3+ years</option><option value="5">5+ years</option><option value="10">10+ years</option></select></label>
      <span>{matches.length} instructors</span>
      {(query || specialty || providerId || minimumExperience) && <button className="btn btn-outline clear-filters" type="button" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
    </div>
    {matches.length ? <><div className="grid instructor-grid">
      {matches.slice(0, visibleCount).map((instructor) => <article className="panel instructor-card" key={instructor.id}>
        <Thumb name={instructor.name} />
        <h3>{instructor.name}</h3>
        <p className="muted">{data.names.get(instructor.provider_id)}</p>
        <div className="listing-tags">{(instructor.specialties || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
        <p>{instructor.experience_years} years experience</p>
        <div className="instructor-actions"><Link className="btn btn-outline" to={`/providers/${instructor.provider_id}`}>View provider</Link><Link className="btn" to={`/bookings?create=1&provider_id=${encodeURIComponent(instructor.provider_id)}`}>Book instructor</Link></div>
      </article>)}
    </div>{visibleCount < matches.length && <button className="btn btn-outline show-more" type="button" onClick={() => setParams((current) => { const next = new URLSearchParams(current); next.set("count", String(visibleCount + 18)); return next; }, { replace: true })}>Show more instructors</button>}</> : <p className="status-message muted">No instructors match these filters.</p>}
  </>;
}

export function instructorsLoader({ request }) {
  return loadInstructors(request.signal);
}
