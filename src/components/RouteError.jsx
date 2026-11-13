import { isRouteErrorResponse, useRevalidator, useRouteError } from "react-router";

export default function RouteError() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return <div className="status-message" role="alert">
    <h1>{notFound ? "Page not found" : "We couldn’t load this page"}</h1>
    <p>{notFound ? "The requested item or page does not exist." : "Check your connection, then try loading this page again."}</p>
    {!notFound && <button className="btn" type="button" disabled={revalidator.state !== "idle"} onClick={() => revalidator.revalidate()}>
      {revalidator.state === "loading" ? "Retrying…" : "Try again"}
    </button>}
  </div>;
}
