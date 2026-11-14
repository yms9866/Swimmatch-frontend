import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="muted">That address doesn't lead anywhere on SwimMatch.</p>
      <Link to="/" className="btn">Go home</Link>
    </>
  );
}
