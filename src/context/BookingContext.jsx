import { createContext, useContext, useReducer } from "react";
import { bookingRequestsReducer } from "../state/bookingReducer.js";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, dispatch] = useReducer(bookingRequestsReducer, []);
  return <BookingContext.Provider value={{ bookings, dispatch }}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookings must be used inside BookingProvider");
  return context;
}
