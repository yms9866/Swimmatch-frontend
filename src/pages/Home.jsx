import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepItem from "../components/StepItem.jsx";
import ProviderTile from "../components/ProviderTile.jsx";
import providers from "../data/providers.js";

const steps = [
  { id: 1, text: "Tell us your needs" },
  { id: 2, text: "Get matched" },
  { id: 3, text: "Book & swim" },
];

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const topRated = [...providers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const start = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}&level=${level}`);
  };

  return (
    <>
      <section className="hero">
        <h1>Find your perfect swim match</h1>
        <p className="muted">Tell us what you need and we'll match you with the right swimming provider</p>
        <form className="hero-form" onSubmit={start}>
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
          <button className="btn" type="submit">Get Started</button>
        </form>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <ol className="steps">
          {steps.map((s) => (
            <StepItem key={s.id} number={s.id} text={s.text} />
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>Top-rated providers near you</h2>
        <div className="grid">
          {topRated.map((p) => (
            <ProviderTile key={p.id} id={p.id} name={p.name} rating={p.rating} caption={`from AED ${p.price}`} />
          ))}
        </div>
      </section>
    </>
  );
}
