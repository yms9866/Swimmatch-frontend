import { Link } from "react-router-dom";
import Thumb from "./Thumb.jsx";

export default function BookingCard({ providerId, provider, lesson, date, place, status }) {
  return (
    <article className="card">
      <Thumb name={provider} />
      <div className="card-body">
        <h3>{provider}</h3>
        <p className="muted">{lesson} · {date} · {place}</p>
        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
      </div>
      <Link to={`/providers/${providerId}`} className="btn btn-outline">View Details</Link>
    </article>
  );
}
