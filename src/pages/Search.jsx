import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProviderCard from "../components/ProviderCard.jsx";
import { filterProviders, getProviders, matchingPrice } from "../services/providers.js";

export default function Search() {
  const [params] = useSearchParams();
  const initial = { level: params.get("level") || "", type: params.get("type") || "", budget: "", location: params.get("location") || "", day: "", where: "" };
  const [form, setForm] = useState(initial);
  const [filters, setFilters] = useState(initial);
  const [sort, setSort] = useState("best");
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [request, setRequest] = useState(0);
  const [hasSearched, setHasSearched] = useState(Boolean(initial.level || initial.type || initial.location));
  const latestRequest = useRef(0);
  const activeController = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setFilters(form), 250);
    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    const controller = new AbortController();
    activeController.current = controller;
    const current = ++latestRequest.current;
    async function load() {
      setStatus("loading");
      setProviders([]);
      let failed = false;
      try {
        const data = await getProviders(controller.signal, filters);
        if (current === latestRequest.current) setProviders(data);
      } catch (error) {
        failed = error.name !== "AbortError";
      } finally {
        if (current === latestRequest.current && !controller.signal.aborted) {
          setStatus(failed ? "error" : "success");
        }
      }
    }
    load();
    return () => controller.abort();
  }, [filters, request]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = filterProviders(providers, filters).filter((provider) =>
      !term || `${provider.name} ${provider.description || ""} ${provider.city} ${provider.area} ${provider.services.map((service) => `${service.name} ${service.description || ""}`).join(" ")}`
        .toLowerCase().includes(term));
    return matches.sort((a, b) => sort === "price"
      ? matchingPrice(a, filters) - matchingPrice(b, filters)
      : b.rating - a.rating);
  }, [providers, filters, sort, query]);

  const change = (event) => {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    activeController.current?.abort();
    latestRequest.current += 1;
    setProviders([]);
    setHasSearched(true);
    setStatus("loading");
  };

  return (
    <>
      <div className="page-heading"><span className="eyebrow">FIND YOUR FIT</span><h1>Find your swimming match</h1><p>Explore providers by level, lesson type, budget, and location.</p></div>
      <div className="marketplace-layout">
      <aside className="filters-panel" aria-label="Search filters">
        <div className="filters-heading"><strong>Filters</strong><span>Refine your search</span></div>
      <form className="form search-form" onSubmit={(event) => event.preventDefault()}>
        <label>Swimming level
          <select name="level" value={form.level} onChange={change}>
            <option value="">Any</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </label>
        <label>Lesson type
          <select name="type" value={form.type} onChange={change}>
            <option value="">Any</option><option>Private</option><option>Group</option>
          </select>
        </label>
        <label>Budget range
          <select name="budget" value={form.budget} onChange={change}>
            <option value="">Any</option><option value="150">Up to AED 150</option><option value="200">Up to AED 200</option><option value="250">Up to AED 250</option>
          </select>
        </label>
        <label>Location or provider
          <input name="location" value={form.location} onChange={change} placeholder="City, area, or name" />
        </label>
        <label>Preferred day
          <select name="day" value={form.day} onChange={change}>
            <option value="">Any day</option>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => <option key={day}>{day}</option>)}
          </select>
        </label>
        <label>Home visit or facility
          <select name="where" value={form.where} onChange={change}>
            <option value="">Either</option><option value="home">Home visit</option><option value="facility">Facility</option>
          </select>
        </label>
      </form>
      </aside>

      <section className="marketplace-results" aria-live="polite">
        <div className="directory-tools search-tools">
          <label htmlFor="provider-search">Search providers or lessons
            <span className="search-input-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
              <input id="provider-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a provider, lesson, or city" />
            </span>
          </label>
        </div>
        {status === "loading" && <p role="status">Loading swimming providers…</p>}
        {status === "error" && (
          <div className="status-message" role="alert">
            <p>Could not load providers. Check your connection and try again.</p>
            <button className="btn" type="button" onClick={() => setRequest((value) => value + 1)}>Retry</button>
          </div>
        )}
        {status === "success" && (
          <>
            <div className="row-between">
              <h2>{results.length} matches{filters.location ? ` for ${filters.location}` : ""}</h2>
              <label className="sort">Sort:
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="best">Highest rated</option><option value="price">Lowest price</option>
                </select>
              </label>
            </div>
            {results.length === 0 && <p className="muted">{query.trim() || hasSearched ? "No providers match your search. Try another name, lesson, location, or filter." : "No providers are available right now."}</p>}
            <div className="listing-grid">
              {results.map((provider) => <ProviderCard key={provider.id} provider={provider} price={matchingPrice(provider, filters)} />)}
            </div>
          </>
        )}
      </section>
      </div>
    </>
  );
}
