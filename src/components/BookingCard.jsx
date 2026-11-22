import { Link } from "react-router";
import Thumb from "./Thumb.jsx";

export default function BookingCard({ provider_id, provider_name, service_name, date, time, place, status, onStatusChange }) {
  return (
    <article className="card">
      <Thumb name={provider_name} />
      <div className="card-body">
        <h3>{provider_name}</h3>
        <p className="muted">{service_name} · {date} {time} · {place}</p>
        {onStatusChange ? <label className="booking-status">Booking status<select value={status.toLowerCase()} onChange={(event) => onStatusChange(event.target.value)}><option value="pending">Pending</option><option value="completed">Completed</option></select></label> : <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>}
      </div>
      <Link to={`/providers/${provider_id}`} className="btn btn-outline">View Details</Link>
    </article>
  );
}
