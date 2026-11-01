import { Link } from "react-router-dom";
import Thumb from "./Thumb.jsx";

export default function ProviderTile({ id, name, rating, caption }) {
  return (
    <Link to={`/providers/${id}`} className="tile">
      <Thumb name={name} size="lg" />
      <span className="tile-content"><strong>{name}</strong><span className="muted">★ {rating} <span aria-hidden="true">·</span> {caption}</span></span>
      <span className="tile-arrow" aria-hidden="true">↗</span>
    </Link>
  );
}
