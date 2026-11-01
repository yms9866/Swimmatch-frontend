import { NavLink, Link } from "react-router-dom";

const links = [
  { id: 1, to: "/", label: "Home" },
  { id: 2, to: "/search", label: "Search" },
  { id: 3, to: "/bookings", label: "Bookings" },
  { id: 4, to: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <header className="nav">
      <Link to="/" className="logo" aria-label="SwimMatch home">
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="20" cy="6" r="3" fill="#ee7a63" />
          <path d="M3 17c3-5 5 4 8 0s5 4 8 0 5 4 8 0M3 24c3-5 5 4 8 0s5 4 8 0 5 4 8 0" fill="none" stroke="#2f9488" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>Swim<b>Match</b></span>
      </Link>
      <nav className="nav-links">
        {links.map((l) => (
          <NavLink key={l.id} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
