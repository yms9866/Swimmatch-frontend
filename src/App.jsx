import { createBrowserRouter, Link, Outlet, useNavigation } from "react-router";
import Navbar from "./components/Navbar.jsx";
import RouteError from "./components/RouteError.jsx";
import Home, { homeLoader } from "./pages/Home.jsx";
import Search, { searchLoader, shouldRevalidateSearch } from "./pages/Search.jsx";
import ProviderDetails, { providerDetailsLoader } from "./pages/ProviderDetails.jsx";
import Bookings, { bookingsLoader, shouldRevalidateBookings } from "./pages/Bookings.jsx";
import Profile from "./pages/Profile.jsx";
import Services, { servicesLoader } from "./pages/Services.jsx";
import Instructors, { instructorsLoader } from "./pages/Instructors.jsx";
import NotFound from "./pages/NotFound.jsx";
import Saved, { savedLoader } from "./pages/Saved.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";

function BookingsRoute() {
  return <BookingProvider><Bookings /></BookingProvider>;
}

function AppLayout() {
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";
  return <>
    <Navbar />

    <main className="page">
      <Outlet />
    </main>
    <footer className="site-footer">
      <div className="footer-inner">
        <div><strong>Swim<span>Match</span></strong><p>Find your place in the water.</p></div>
        <nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/search">Find providers</Link><Link to="/services">Services</Link><Link to="/instructors">Instructors</Link></nav>
      </div>
    </footer>
  </>;
}

export const router = createBrowserRouter([{
  Component: AppLayout,
  children: [
    { index: true, Component: Home, loader: homeLoader, errorElement: <RouteError /> },
    { path: "search", Component: Search, loader: searchLoader, shouldRevalidate: shouldRevalidateSearch, errorElement: <RouteError /> },
    { path: "services", Component: Services, loader: servicesLoader, shouldRevalidate: shouldRevalidateDirectory, errorElement: <RouteError /> },
    { path: "instructors", Component: Instructors, loader: instructorsLoader, shouldRevalidate: shouldRevalidateDirectory, errorElement: <RouteError /> },
    { path: "providers/:id", Component: ProviderDetails, loader: providerDetailsLoader, errorElement: <RouteError /> },
    { path: "bookings", Component: BookingsRoute, loader: bookingsLoader, shouldRevalidate: shouldRevalidateBookings, errorElement: <RouteError /> },
    { path: "profile", Component: Profile },
    { path: "saved", Component: Saved, loader: savedLoader, shouldRevalidate: shouldRevalidateDirectory, errorElement: <RouteError /> },
    { path: "*", Component: NotFound },
  ],
}]);

function shouldRevalidateDirectory({ currentUrl, nextUrl, formMethod, defaultShouldRevalidate }) {
  if (formMethod || currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;
  return false;
}

export default AppLayout;
