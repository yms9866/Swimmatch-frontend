export default function ResourceState({ status, retry, subject = "data" }) {
  if (status === "loading") return <p role="status">Loading {subject}…</p>;
  if (status === "error") return <div className="status-message" role="alert"><p>Could not load {subject}. Check your connection and try again.</p><button className="btn" type="button" onClick={retry}>Retry</button></div>;
  return null;
}
