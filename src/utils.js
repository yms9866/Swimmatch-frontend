export const stars = (rating) => {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
};
export const initials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("");
