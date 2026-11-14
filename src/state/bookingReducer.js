export function bookingRequestsReducer(state, action) {
  switch (action.type) {
    case "booking/requested":
      return [action.booking, ...state];
    default:
      return state;
  }
}
