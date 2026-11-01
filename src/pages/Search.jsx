import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProviderCard from "../components/ProviderCard.jsx";
import ProviderTile from "../components/ProviderTile.jsx";
import providers from "../data/providers.js";

const recentIds = [3, 8, 24];

export default function Search() {
  const [params] = useSearchParams();
  const start = { level: params.get("level") || "", type: "", budget: "", location: params.get("location") || "", date: "", where: "" };
  const [form, setForm] = useState(start);
  const [filters, setFilters] = useState(start);
  const [sort, setSort] = useState("best");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setFilters(form);
  };

  const results = providers
    .filter((p) => !filters.level || p.levels.includes(filters.level))
    .filter((p) => !filters.type || p.lessonTypes.includes(filters.type))
    .filter((p) => !filters.budget || p.price <= Number(filters.budget))
    .filter((p) => !filters.location || `${p.city} ${p.area}`.toLowerCase().includes(filters.location.toLowerCase()))
    .filter((p) => filters.where !== "home" || p.homeVisit)
    .sort((a, b) => (sort === "price" ? a.price - b.price : sort === "distance" ? a.distanceKm - b.distanceKm : b.rating - a.rating));

  return (
    <>
      <h1>Find your swimming match</h1>
      <form className="form" onSubmit={submit}>
        <label>Swimming level
          <select name="level" value={form.level} onChange={change}>
            <option value="">Any</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </label>
        <label>Lesson type (Private / Group)
          <select name="type" value={form.type} onChange={change}>
            <option value="">Any</option><option>Private</option><option>Group</option>
          </select>
        </label>
        <label>Budget range
          <select name="budget" value={form.budget} onChange={change}>
            <option value="">Any</option><option value="150">Up to AED 150</option><option value="200">Up to AED 200</option><option value="250">Up to AED 250</option>
          </select>
        </label>
        <label>Location
          <input name="location" value={form.location} onChange={change} placeholder="City or area" />
        </label>
        <label>Preferred date / schedule
          <input name="date" type="date" value={form.date} onChange={change} />
        </label>
        <label>Home visit or facility
          <select name="where" value={form.where} onChange={change}>
            <option value="">Either</option><option value="home">Home visit</option><option value="facility">Facility</option>
          </select>
        </label>
        <button className="btn" type="submit">Find Matches</button>
      </form>

      <section className="section">
        <div className="row-between">
          <h2>{results.length} matches{filters.location ? ` near ${filters.location}` : ""}</h2>
          <label className="sort">Sort:
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="best">Best match</option><option value="price">Lowest price</option><option value="distance">Nearest</option>
            </select>
          </label>
        </div>
        {results.length === 0 && <p className="muted">No providers match these filters. Try a different level, budget or location.</p>}
        <div className="stack">
          {results.map((p) => (
            <ProviderCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="muted-h">Recently viewed providers</h2>
        <div className="grid">
          {providers.filter((p) => recentIds.includes(p.id)).map((p) => (
            <ProviderTile key={p.id} id={p.id} name={p.name} rating={p.rating} caption={p.area} />
          ))}
        </div>
      </section>
    </>
  );
}
