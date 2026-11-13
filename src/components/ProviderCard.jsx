import { Link } from "react-router";
import Thumb from "./Thumb.jsx";
import { stars } from "../utils.js";
import { useSavedProviders } from "../context/SavedProvidersContext.jsx";

export default function ProviderCard({ provider, price }) {
  const { savedProviders, dispatch } = useSavedProviders();
  const isSaved = savedProviders.includes(provider.id);
  const lessonTypes = [...new Set(provider.services.map((service) => service.type))];
  return (
    <article className="listing-card">
      <div className="listing-image"><Thumb name={provider.name} size="lg" /><span className="listing-badge">Swimming provider</span></div>
      <div className="listing-body">
        <p className="listing-location">{provider.area}, {provider.city}</p>
        <h3>{provider.name}</h3>
        <p className="provider-meta"><span className="rating"><span className="stars">{stars(provider.rating)}</span> {provider.rating}</span>{provider.reviews_count > 0 && <span>({provider.reviews_count} reviews)</span>}</p>
        <p className="muted provider-description">{provider.description}</p>
        <div className="listing-tags">{lessonTypes.map((type) => <span key={type}>{type} lessons</span>)}{provider.home_visit && <span>Home visit</span>}</div>
        <div className="listing-footer"><div>{price != null && <><span className="listing-from">Starting from</span><p className="price">AED {price}<small> / session</small></p></>}</div><div className="listing-actions"><button className={`save-button${isSaved ? " is-saved" : ""}`} type="button" aria-pressed={isSaved} onClick={() => dispatch({ type: "provider/toggled", id: provider.id })}>{isSaved ? "Saved ✓" : "♡ Save"}</button><Link to={`/providers/${provider.id}`} className="btn">View provider <span aria-hidden="true">→</span></Link></div></div>
      </div>
    </article>
  );
}
