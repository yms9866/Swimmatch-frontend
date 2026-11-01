import { getBookings } from "../services/providers.js";
import useResource from "../hooks/useResource.js";
import BookingCard from "../components/BookingCard.jsx";
import ResourceState from "../components/ResourceState.jsx";

export default function Bookings() {
  const { data, status, retry } = useResource(getBookings);
  return <>
    <div className="page-heading"><span className="eyebrow">YOUR SWIM SCHEDULE</span><h1>Sample bookings</h1><p>See what a booking looks like on SwimMatch.</p></div>
    <ResourceState status={status} retry={retry} subject="bookings" />
    {status === "success" && (data.length ? <div className="stack">
      {data.map((booking) => <BookingCard key={booking.id} {...booking} />)}
    </div> : <p className="muted">No bookings yet.</p>)}
  </>;
}
