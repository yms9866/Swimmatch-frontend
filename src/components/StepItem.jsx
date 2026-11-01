export default function StepItem({ number, text }) {
  return (
    <li className="step">
      <span className="step-num">{number}</span>
      <span>{text}</span>
    </li>
  );
}
