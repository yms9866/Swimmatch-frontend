import { useState } from "react";
import { Link } from "react-router-dom";
import { getProviderSummaries, getServices } from "../services/providers.js";
import useResource from "../hooks/useResource.js";
import ResourceState from "../components/ResourceState.jsx";

async function loadServices(signal) {
  const [services, providers] = await Promise.all([getServices(signal), getProviderSummaries(signal)]);
  return { services, names: new Map(providers.map((provider) => [provider.id, provider.name])) };
}

export default function Services() {
  const { data, status, retry } = useResource(loadServices);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);
  const matches = data?.services.filter((service) =>
    `${service.name} ${service.description} ${service.level} ${service.type} ${data.names.get(service.provider_id)}`
      .toLowerCase().includes(query.trim().toLowerCase())) || [];
  return <>
    <div className="page-heading"><span className="eyebrow">EXPLORE LESSONS</span><h1>Swimming services</h1><p>Compare lessons from providers across the UAE.</p></div>
    <ResourceState status={status} retry={retry} subject="services" />
    {status === "success" && <>
      <div className="directory-tools"><label>Search services<input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(18); }} placeholder="Lesson, provider, or level" /></label><span>{matches.length} services</span></div>
      {matches.length ? <><div className="services-grid">
        {matches.slice(0, visibleCount).map((service) => <article className="card service-card" key={service.id}>
          <div className="card-body">
            <p className="listing-location">{data.names.get(service.provider_id)}</p>
            <h3>{service.name}</h3>
            <div className="listing-tags"><span>{service.level}</span><span>{service.type}</span><span>{service.duration_minutes} min</span></div>
            <p className="muted">{service.description}</p>
          </div>
          <div className="service-footer"><p className="price">{service.currency} {service.price}<small> / session</small></p><Link className="btn btn-outline" to={`/providers/${service.provider_id}`}>View provider →</Link></div>
        </article>)}
      </div>{visibleCount < matches.length && <button className="btn btn-outline show-more" type="button" onClick={() => setVisibleCount((count) => count + 18)}>Show more services</button>}</> : <p className="status-message muted">No services match your search.</p>}
    </>}
  </>;
}
