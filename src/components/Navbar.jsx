import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const links = [
  { id: 1, to: "/", label: "Home" },
  { id: 2, to: "/search", label: "Search" },
  { id: 3, to: "/services", label: "Services" },
  { id: 4, to: "/instructors", label: "Instructors" },
  { id: 5, to: "/bookings", label: "Bookings" },
  { id: 6, to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  };

  return (
    <header className="nav" onKeyDown={handleKeyDown}>
      <Link to="/" className="logo" aria-label="SwimMatch home" onClick={() => setMenuOpen(false)}>
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="20" cy="6" r="3" fill="#ee7a63" />
          <path d="M3 17c3-5 5 4 8 0s5 4 8 0 5 4 8 0M3 24c3-5 5 4 8 0s5 4 8 0 5 4 8 0" fill="none" stroke="#2f9488" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>Swim<b>Match</b></span>
      </Link>
      <button
        ref={menuButton}
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} />
        </svg>
      </button>
      <nav id="primary-navigation" className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        {links.map((l) => (
          <NavLink key={l.id} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
