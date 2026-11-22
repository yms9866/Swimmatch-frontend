import { createContext, useContext, useEffect, useReducer } from "react";
import { bookingRequestsReducer, BOOKINGS_STORAGE_KEY, initializeBookings } from "../state/bookingReducer.js";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, dispatch] = useReducer(bookingRequestsReducer, [], initializeBookings);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Booking status and summaries remain available in memory if storage is unavailable.
    }
  }, [bookings]);

  return <BookingContext.Provider value={{ bookings, dispatch }}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookings must be used inside BookingProvider");
  return context;
}
