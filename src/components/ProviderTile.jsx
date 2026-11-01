import { Link } from "react-router-dom";
import Thumb from "./Thumb.jsx";

export default function ProviderTile({ id, name, rating, caption }) {
  return (
    <Link to={`/providers/${id}`} className="tile">
      <Thumb name={name} size="lg" />
      <strong>{name}</strong>
      <span className="muted">{rating} rating · {caption}</span>
    </Link>
  );
}
