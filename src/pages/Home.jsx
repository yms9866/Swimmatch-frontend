import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StepItem from "../components/StepItem.jsx";
import ProviderTile from "../components/ProviderTile.jsx";
import { getProviders, matchingPrice } from "../services/providers.js";

const steps = [
  { id: 1, text: "Tell us your needs" },
  { id: 2, text: "Get matched" },
  { id: 3, text: "Book & swim" },
];

const categories = [
  { label: "Beginner lessons", detail: "Build confidence in the water", to: "/search?level=Beginner", symbol: "01" },
  { label: "Private coaching", detail: "Focused one-to-one sessions", to: "/search?type=Private", symbol: "02" },
  { label: "Group classes", detail: "Learn and swim together", to: "/search?type=Group", symbol: "03" },
];

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [request, setRequest] = useState(0);
  const topRated = [...providers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setStatus("loading");
      setProviders([]);
      try {
        const data = await getProviders(controller.signal);
        if (!controller.signal.aborted) {
          setProviders(data);
          setStatus("success");
        }
      } catch (error) {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    load();
    return () => controller.abort();
  }, [request]);

  const start = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}&level=${level}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR SWIMMING JOURNEY STARTS HERE</span>
          <h1>Find your perfect <em>swim match.</em></h1>
          <p>Discover swimming lessons and experienced instructors that fit your goals, schedule, and location.</p>
          <div className="hero-highlights" aria-label="What you can find">
            <span>Swimming lessons</span><span>Experienced instructors</span><span>Flexible options</span>
          </div>
        </div>
        <form className="hero-form" onSubmit={start}>
          <div className="hero-form-heading"><strong>Find a provider</strong><span>Start with a location and level</span></div>
          <label>Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sharjah" />
          </label>
          <label>Level
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Any level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <button className="btn" type="submit">Explore matches <span aria-hidden="true">→</span></button>
        </form>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">BROWSE BY CATEGORY</span><h2>What are you looking for?</h2></div><p>Find the right way to get started.</p></div>
        <div className="category-grid">
          {categories.map((category) => <Link className="category-card" to={category.to} key={category.label}>
            <span className="category-icon" aria-hidden="true">{category.symbol}</span>
            <strong>{category.label}</strong>
            <span className="muted">{category.detail}</span>
            <span className="category-arrow" aria-hidden="true">→</span>
          </Link>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">SIMPLE FROM THE START</span><h2>How it works</h2></div><p>From first search to first splash in three steps.</p></div>
        <ol className="steps">
          {steps.map((s) => (
            <StepItem key={s.id} number={s.id} text={s.text} />
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">EXPLORE SWIMMATCH</span><h2>Top-rated providers</h2></div><p>Browse highly rated options from the live provider list.</p></div>
        {status === "loading" && <p role="status">Loading providers…</p>}
        {status === "error" && <div className="status-message" role="alert"><p>Could not load providers. Check your connection and try again.</p><button className="btn" type="button" onClick={() => setRequest((value) => value + 1)}>Retry</button></div>}
        {status === "success" && (topRated.length ? <div className="grid">
          {topRated.map((p) => <ProviderTile key={p.id} id={p.id} name={p.name} rating={p.rating} caption={`from AED ${matchingPrice(p)}`} />)}
        </div> : <p className="muted">No providers are available right now.</p>)}
      </section>
    </>
  );
}
