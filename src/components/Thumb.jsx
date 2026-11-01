import { initials } from "../utils.js";

export default function Thumb({ name, size = "md" }) {
  return (
    <div className={`thumb thumb-${size}`} role="img" aria-label={name}>
      {initials(name)}
    </div>
  );
}
