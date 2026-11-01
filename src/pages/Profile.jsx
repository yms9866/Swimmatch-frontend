import { getProfile } from "../services/providers.js";
import useResource from "../hooks/useResource.js";
import ResourceState from "../components/ResourceState.jsx";
import Thumb from "../components/Thumb.jsx";

export default function Profile() {
  const { data, status, retry } = useResource(getProfile);
  return <>
    <div className="page-heading"><span className="eyebrow">SWIMMER DETAILS</span><h1>Sample profile</h1><p>A preview of your swimmer information.</p></div>
    <ResourceState status={status} retry={retry} subject="profile" />
    {status === "success" && <section className="card profile-card">
      <Thumb name={data.name} />
      <div className="card-body">
        <h3>{data.name}</h3>
        <ul className="rows plain">
          <li><span className="muted">Email</span><span>{data.email}</span></li>
          <li><span className="muted">Location</span><span>{data.location}</span></li>
          <li><span className="muted">Swimming level</span><span>{data.swimming_level}</span></li>
          <li><span className="muted">Preferred lessons</span><span>{data.preferred_lessons.join(", ")}</span></li>
        </ul>
      </div>
    </section>}
  </>;
}
