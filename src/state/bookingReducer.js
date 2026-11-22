export const BOOKINGS_STORAGE_KEY = "swimmatch.bookings";

const BOOKING_STATUSES = ["pending", "completed"];

export function sanitizeBooking(booking) {
  if (!booking || typeof booking !== "object" ||
    (typeof booking.id !== "string" && typeof booking.id !== "number") ||
    (typeof booking.provider_id !== "string" && typeof booking.provider_id !== "number") ||
    typeof booking.provider_name !== "string" || typeof booking.service_name !== "string" ||
    typeof booking.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) ||
    typeof booking.time !== "string" || !["Home visit", "Provider facility"].includes(booking.place) ||
    !BOOKING_STATUSES.includes(booking.status)) return null;

  // Persist only the booking summary; contact fields and free-text notes are excluded.
  return {
    id: booking.id,
    provider_id: booking.provider_id,
    provider_name: booking.provider_name,
    service_name: booking.service_name,
    date: booking.date,
    time: booking.time,
    place: booking.place,
    status: booking.status,
  };
}

export function initializeBookings(fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY));
    if (!Array.isArray(saved)) return fallback;
    return saved.map(sanitizeBooking).filter(Boolean);
  } catch {
    return fallback;
  }
}

export function bookingRequestsReducer(state, action) {
  switch (action.type) {
    case "booking/requested": {
      const booking = sanitizeBooking(action.booking);
      return booking ? [booking, ...state] : state;
    }
    default:
      return state;
  }
}
