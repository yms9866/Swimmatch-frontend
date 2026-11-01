import BookingCard from "../components/BookingCard.jsx";
import bookings from "../data/bookings.js";

export default function Bookings() {
  return (
    <>
      <h1>My Bookings</h1>
      <div className="stack">
        {bookings.map((b) => (
          <BookingCard key={b.id} {...b} />
        ))}
      </div>
    </>
  );
}
