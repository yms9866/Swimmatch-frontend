import { Link } from "react-router-dom";
import Thumb from "./Thumb.jsx";

export default function BookingCard({ provider_id, provider_name, service_name, date, time, place, status }) {
  return (
    <article className="card">
      <Thumb name={provider_name} />
      <div className="card-body">
        <h3>{provider_name}</h3>
        <p className="muted">{service_name} · {date} {time} · {place}</p>
        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
      </div>
      <Link to={`/providers/${provider_id}`} className="btn btn-outline">View Details</Link>
    </article>
  );
}
