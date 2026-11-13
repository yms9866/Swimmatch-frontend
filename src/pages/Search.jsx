import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import ProviderCard from "../components/ProviderCard.jsx";
import { filterProviders, getProviders, matchingPrice } from "../services/providers.js";
import { useProfile } from "../context/ProfileContext.jsx";

const FILTER_FIELDS = ["level", "type", "budget", "location", "day", "where"];

function readFilters(params, profile = {}) {
  return {
    level: params.has("level") ? params.get("level") : profile.swimming_level || "",
    type: params.get("type") || "",
    budget: params.get("budget") || "",
    location: params.has("location") ? params.get("location") : profile.location || "",
    day: params.get("day") || "",
    where: params.get("where") || "",
  };
}

export function searchLoader({ request }) {
  const params = new URL(request.url).searchParams;
  const filters = Object.fromEntries(FILTER_FIELDS.map((field) => [field, params.get(field) || ""]));
  return getProviders(request.signal, filters);
}

export function shouldRevalidateSearch({ currentUrl, nextUrl, formMethod, defaultShouldRevalidate }) {
  if (formMethod || currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;
  return FILTER_FIELDS.some((field) => currentUrl.searchParams.get(field) !== nextUrl.searchParams.get(field));
}

export default function Search() {
  const providers = useLoaderData();
  const { state } = useProfile();
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params, state.profile);
  const query = params.get("q") || "";
  const sort = params.get("sort") || "best";

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = filterProviders(providers, filters).filter((provider) =>
      !term || `${provider.name} ${provider.description || ""} ${provider.city} ${provider.area} ${provider.services.map((service) => `${service.name} ${service.description || ""}`).join(" ")}`
        .toLowerCase().includes(term));
    return matches.sort((a, b) => sort === "price"
      ? matchingPrice(a, filters) - matchingPrice(b, filters)
      : b.rating - a.rating);
  }, [providers, filters.level, filters.type, filters.budget, filters.location, filters.day, filters.where, sort, query]);

  const updateParam = (key, value) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (FILTER_FIELDS.includes(key)) next.set(key, value);
      else if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });
  };

  const changeFilter = (event) => updateParam(event.target.name, event.target.value);

  return <>
    <div className="page-heading"><span className="eyebrow">FIND YOUR FIT</span><h1>Find your swimming match</h1><p>Explore providers by level, lesson type, budget, and location.</p></div>
    <div className="marketplace-layout">
      <aside className="filters-panel" aria-label="Search filters">
        <div className="filters-heading"><strong>Filters</strong><span>Refine your search</span></div>
        <div className="form search-form">
          <label>Swimming level
            <select name="level" value={filters.level} onChange={changeFilter}>
              <option value="">Any</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </label>
          <label>Lesson type
            <select name="type" value={filters.type} onChange={changeFilter}>
              <option value="">Any</option><option>Private</option><option>Group</option>
            </select>
          </label>
          <label>Budget range
            <select name="budget" value={filters.budget} onChange={changeFilter}>
              <option value="">Any</option><option value="150">Up to AED 150</option><option value="200">Up to AED 200</option><option value="250">Up to AED 250</option>
            </select>
          </label>
          <label>Location or provider
            <input name="location" value={filters.location} onChange={changeFilter} placeholder="City, area, or name" />
          </label>
          <label>Preferred day
            <select name="day" value={filters.day} onChange={changeFilter}>
              <option value="">Any day</option>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => <option key={day}>{day}</option>)}
            </select>
          </label>
          <label>Home visit or facility
            <select name="where" value={filters.where} onChange={changeFilter}>
              <option value="">Either</option><option value="home">Home visit</option><option value="facility">Facility</option>
            </select>
          </label>
        </div>
      </aside>

      <section className="marketplace-results" aria-live="polite">
        <div className="directory-tools search-tools">
          <label htmlFor="provider-search">Search providers or lessons
            <span className="search-input-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
              <input id="provider-search" type="search" value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="Try a provider, lesson, or city" />
            </span>
          </label>
        </div>
        <div className="row-between">
          <h2>{results.length} matches{filters.location ? ` for ${filters.location}` : ""}</h2>
          <label className="sort">Sort:
            <select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
              <option value="best">Highest rated</option><option value="price">Lowest price</option>
            </select>
          </label>
        </div>
        {results.length === 0 && <p className="muted">{query.trim() || FILTER_FIELDS.some((field) => params.has(field) && params.get(field)) ? "No providers match your search. Try another name, lesson, location, or filter." : "No providers are available right now."}</p>}
        <div className="listing-grid">
          {results.map((provider) => <ProviderCard key={provider.id} provider={provider} price={matchingPrice(provider, filters)} />)}
        </div>
      </section>
    </div>
  </>;
}
