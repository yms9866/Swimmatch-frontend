import { Link } from "react-router-dom";
import Thumb from "./Thumb.jsx";
import { stars } from "../utils.js";

export default function ProviderCard({ id, name, rating, levels, lessonTypes, distanceKm, homeVisit, price }) {
  return (
    <article className="card">
      <Thumb name={name} />
      <div className="card-body">
        <h3>{name}</h3>
        <p className="muted"><span className="stars">{stars(rating)}</span> {rating} · {levels.join(" & ")} · {lessonTypes.join("/")}</p>
        <p className="muted">{distanceKm.toFixed(1)} km away{homeVisit ? " · Home visits available" : ""}</p>
        <p className="price">AED {price}/session</p>
      </div>
      <Link to={`/providers/${id}`} className="btn">View Profile</Link>
    </article>
  );
}
