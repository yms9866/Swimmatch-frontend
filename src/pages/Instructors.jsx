import { Link, useLoaderData, useSearchParams } from "react-router";
import { getAllInstructors, getProviderSummaries } from "../services/providers.js";
import Thumb from "../components/Thumb.jsx";

async function loadInstructors(signal) {
  const [instructors, providers] = await Promise.all([getAllInstructors(signal), getProviderSummaries(signal)]);
  return { instructors, names: new Map(providers.map((provider) => [provider.id, provider.name])) };
}

export default function Instructors() {
  const data = useLoaderData();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const visibleCount = Math.max(18, Number(params.get("count")) || 18);
  const matches = data?.instructors.filter((instructor) =>
    `${instructor.name} ${instructor.specialties.join(" ")} ${data.names.get(instructor.provider_id)}`
      .toLowerCase().includes(query.trim().toLowerCase())) || [];
  return <>
    <div className="page-heading"><span className="eyebrow">MEET THE COACHES</span><h1>Swimming instructors</h1><p>Find experienced instructors and explore their specialties.</p></div>
    <>
      <div className="directory-tools"><label>Search instructors<input value={query} onChange={(event) => setParams((current) => { const next = new URLSearchParams(current); const value = event.target.value; if (value) next.set("q", value); else next.delete("q"); next.delete("count"); return next; }, { replace: true })} placeholder="Name, provider, or specialty" /></label><span>{matches.length} instructors</span></div>
      {matches.length ? <><div className="grid instructor-grid">
        {matches.slice(0, visibleCount).map((instructor) => <article className="panel instructor-card" key={instructor.id}>
          <Thumb name={instructor.name} />
          <h3>{instructor.name}</h3>
          <p className="muted">{data.names.get(instructor.provider_id)}</p>
          <div className="listing-tags">{instructor.specialties.slice(0, 3).map((specialty) => <span key={specialty}>{specialty}</span>)}</div>
          <p>{instructor.experience_years} years experience</p>
          <Link className="btn btn-outline" to={`/providers/${instructor.provider_id}`}>View provider →</Link>
        </article>)}
      </div>{visibleCount < matches.length && <button className="btn btn-outline show-more" type="button" onClick={() => setParams((current) => { const next = new URLSearchParams(current); next.set("count", String(visibleCount + 18)); return next; }, { replace: true })}>Show more instructors</button>}</> : <p className="status-message muted">No instructors match your search.</p>}
    </>
  </>;
}

export function instructorsLoader({ request }) {
  return loadInstructors(request.signal);
}
