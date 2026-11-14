import { Link, useLoaderData } from "react-router";
import ProviderCard from "../components/ProviderCard.jsx";
import { getProviders } from "../services/providers.js";
import { useSavedProviders } from "../context/SavedProvidersContext.jsx";

export default function Saved() {
  const { savedProviders } = useSavedProviders();
  const providers = useLoaderData();
  const saved = providers.filter((provider) => savedProviders.includes(provider.id));
  return <>
    <div className="page-heading"><span className="eyebrow">YOUR SHORTLIST</span><h1>Saved providers</h1><p>Your saved providers stay on this device, even after you reload.</p></div>
    {savedProviders.length === 0 ? <div className="status-message"><p>You have not saved any providers yet.</p><Link className="btn" to="/search">Explore providers</Link></div> : saved.length ? <div className="listing-grid">{saved.map((provider) => <ProviderCard key={provider.id} provider={provider} price={provider.services?.length ? Math.min(...provider.services.map((service) => service.price)) : null} />)}</div> : <p className="status-message">Some saved providers are no longer listed. They’ll appear here again if they return to the directory.</p>}
  </>;
}

export function savedLoader({ request }) {
  return getProviders(request.signal);
}
