import { Link, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import ProviderDetails from "./pages/ProviderDetails.jsx";
import Bookings from "./pages/Bookings.jsx";
import Profile from "./pages/Profile.jsx";
import Services from "./pages/Services.jsx";
import Instructors from "./pages/Instructors.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/services" element={<Services />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div><strong>Swim<span>Match</span></strong><p>Find your place in the water.</p></div>
          <nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/search">Find providers</Link><Link to="/services">Services</Link><Link to="/instructors">Instructors</Link></nav>
        </div>
      </footer>
    </>
  );
}
