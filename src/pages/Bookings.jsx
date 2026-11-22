import { useLoaderData, useSearchParams } from "react-router";
import { getBookings, getProviders } from "../services/providers.js";
import BookingCard from "../components/BookingCard.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { useBookings } from "../context/BookingContext.jsx";

export default function Bookings() {
  const { bookings: existingBookings, providers } = useLoaderData();
  const { bookings: requestedBookings } = useBookings();
  const [params, setParams] = useSearchParams();
  const formOpen = params.get("create") === "1";
  return <>
    <div className="bookings-heading">
      <div className="page-heading"><span className="eyebrow">YOUR SWIM SCHEDULE</span><h1>Bookings</h1><p>Request a lesson and update your booking status at any time.</p></div>
      <button className="btn" type="button" aria-expanded={formOpen} aria-controls="booking-request-form" onClick={() => setParams((current) => {
        const next = new URLSearchParams(current);
        if (formOpen) next.delete("create");
        else next.set("create", "1");
        return next;
      }, { replace: true })}>{formOpen ? "Close booking form" : "Create booking"}</button>
    </div>
    <div id="booking-request-form" className="booking-form-wrap" hidden={!formOpen}>
      {formOpen && <BookingForm providers={providers} />}
    </div>
    <section className="section">
      <div className="section-heading"><div><span className="eyebrow">YOUR REQUESTS</span><h2>Your bookings</h2></div><p>New requests appear here right away.</p></div>
      {requestedBookings.length || existingBookings.length ? <div className="stack">
        {requestedBookings.map((booking) => <BookingCard key={`request-${booking.id}`} {...booking} />)}
        {existingBookings.map((booking) => <BookingCard key={`existing-${booking.id}`} {...booking} />)}
      </div> : <p className="muted">No bookings yet.</p>}
    </section>
  </>;
}

export function bookingsLoader({ request }) {
  return Promise.all([
    getBookings(request.signal),
    getProviders(request.signal),
  ]).then(([bookings, providers]) => ({ bookings, providers }));
}

export function shouldRevalidateBookings(args) {
  return shouldRevalidateDirectory(args);
}

function shouldRevalidateDirectory({ currentUrl, nextUrl, formMethod, defaultShouldRevalidate }) {
  if (formMethod || currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;
  return false;
}
