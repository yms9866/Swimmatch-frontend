import { Link, useLoaderData, useSearchParams } from "react-router";
import { getProviderSummaries, getServices } from "../services/providers.js";

async function loadServices(signal) {
  const [services, providers] = await Promise.all([getServices(signal), getProviderSummaries(signal)]);
  return { services, names: new Map(providers.map((provider) => [provider.id, provider.name])) };
}

export default function Services() {
  const data = useLoaderData();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const level = params.get("level") || "";
  const type = params.get("type") || "";
  const maxPrice = params.get("max_price") || "";
  const visibleCount = Math.max(18, Number(params.get("count")) || 18);
  const matches = data.services.filter((service) => {
    const text = `${service.name} ${service.description || ""} ${service.level} ${service.type} ${data.names.get(service.provider_id) || ""}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) &&
      (!level || service.level?.toLowerCase() === level.toLowerCase()) &&
      (!type || service.type?.toLowerCase() === type.toLowerCase()) &&
      (!maxPrice || Number(service.price) <= Number(maxPrice));
  });

  const updateParam = (key, value) => setParams((current) => {
    const next = new URLSearchParams(current);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "count") next.delete("count");
    return next;
  }, { replace: true });

  return <>
    <div className="page-heading"><span className="eyebrow">EXPLORE LESSONS</span><h1>Swimming services</h1><p>Compare lessons from providers across the UAE.</p></div>
    <div className="directory-tools catalog-tools">
      <label>Search services<input value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="Lesson, provider, or level" /></label>
      <label>Swimming level<select value={level} onChange={(event) => updateParam("level", event.target.value)}><option value="">Any level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
      <label>Lesson type<select value={type} onChange={(event) => updateParam("type", event.target.value)}><option value="">Any type</option><option>Private</option><option>Group</option></select></label>
      <label>Maximum price<select value={maxPrice} onChange={(event) => updateParam("max_price", event.target.value)}><option value="">Any price</option><option value="150">AED 150</option><option value="200">AED 200</option><option value="250">AED 250</option><option value="300">AED 300</option></select></label>
      <span>{matches.length} services</span>
      {(query || level || type || maxPrice) && <button className="btn btn-outline clear-filters" type="button" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
    </div>
    {matches.length ? <><div className="services-grid">
      {matches.slice(0, visibleCount).map((service) => <article className="card service-card" key={service.id}>
        <div className="card-body">
          <p className="listing-location">{data.names.get(service.provider_id)}</p>
          <h3>{service.name}</h3>
          <div className="listing-tags"><span>{service.level}</span><span>{service.type}</span><span>{service.duration_minutes} min</span></div>
          <p className="muted">{service.description}</p>
        </div>
        <div className="service-footer"><p className="price">{service.currency} {service.price}<small> / session</small></p><div className="service-actions"><Link className="btn btn-outline" to={`/providers/${service.provider_id}`}>View provider</Link><Link className="btn" to={`/bookings?create=1&provider_id=${encodeURIComponent(service.provider_id)}&service_id=${encodeURIComponent(service.id)}`}>Book lesson</Link></div></div>
      </article>)}
    </div>{visibleCount < matches.length && <button className="btn btn-outline show-more" type="button" onClick={() => setParams((current) => { const next = new URLSearchParams(current); next.set("count", String(visibleCount + 18)); return next; }, { replace: true })}>Show more services</button>}</> : <p className="status-message muted">No services match these filters.</p>}
  </>;
}

export function servicesLoader({ request }) {
  return loadServices(request.signal);
}
