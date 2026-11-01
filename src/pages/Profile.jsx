import Thumb from "../components/Thumb.jsx";

const details = [
  { id: 1, label: "Email", value: "swimmer@example.com" },
  { id: 2, label: "Location", value: "Sharjah, UAE" },
  { id: 3, label: "Swimming level", value: "Beginner" },
  { id: 4, label: "Preferred lessons", value: "Private, home visit" },
];

export default function Profile() {
  return (
    <>
      <h1>Profile</h1>
      <section className="card profile-card">
        <Thumb name="Guest Swimmer" />
        <div className="card-body">
          <h3>Guest Swimmer</h3>
          <ul className="rows plain">
            {details.map((d) => (<li key={d.id}><span className="muted">{d.label}</span><span>{d.value}</span></li>))}
          </ul>
        </div>
      </section>
    </>
  );
}
