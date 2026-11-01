export default function StepCard({ number, title, text }) {
  return (
    <div className="step">
      <span className="step-number">{number}</span>
      <div>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
      </div>
    </div>
  );
}
