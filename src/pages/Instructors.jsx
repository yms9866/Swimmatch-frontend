import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllInstructors, getProviderSummaries } from "../services/providers.js";
import useResource from "../hooks/useResource.js";
import ResourceState from "../components/ResourceState.jsx";
import Thumb from "../components/Thumb.jsx";

async function loadInstructors(signal) {
  const [instructors, providers] = await Promise.all([getAllInstructors(signal), getProviderSummaries(signal)]);
  return { instructors, names: new Map(providers.map((provider) => [provider.id, provider.name])) };
}

export default function Instructors() {
  const { data, status, retry } = useResource(loadInstructors);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);
  const matches = data?.instructors.filter((instructor) =>
    `${instructor.name} ${instructor.specialties.join(" ")} ${data.names.get(instructor.provider_id)}`
      .toLowerCase().includes(query.trim().toLowerCase())) || [];
  return <>
    <div className="page-heading"><span className="eyebrow">MEET THE COACHES</span><h1>Swimming instructors</h1><p>Find experienced instructors and explore their specialties.</p></div>
    <ResourceState status={status} retry={retry} subject="instructors" />
    {status === "success" && <>
      <div className="directory-tools"><label>Search instructors<input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(18); }} placeholder="Name, provider, or specialty" /></label><span>{matches.length} instructors</span></div>
      {matches.length ? <><div className="grid instructor-grid">
        {matches.slice(0, visibleCount).map((instructor) => <article className="panel instructor-card" key={instructor.id}>
          <Thumb name={instructor.name} />
          <h3>{instructor.name}</h3>
          <p className="muted">{data.names.get(instructor.provider_id)}</p>
          <div className="listing-tags">{instructor.specialties.slice(0, 3).map((specialty) => <span key={specialty}>{specialty}</span>)}</div>
          <p>{instructor.experience_years} years experience</p>
          <Link className="btn btn-outline" to={`/providers/${instructor.provider_id}`}>View provider →</Link>
        </article>)}
      </div>{visibleCount < matches.length && <button className="btn btn-outline show-more" type="button" onClick={() => setVisibleCount((count) => count + 18)}>Show more instructors</button>}</> : <p className="status-message muted">No instructors match your search.</p>}
    </>}
  </>;
}
