// Mock data for Phase 2. Phase 3 replaces this with live data from the SwimMatch API.
const schedule = [
  { id: 1, day: "Saturday", time: "9:00 AM – 1:00 PM" },
  { id: 2, day: "Sunday", time: "4:00 PM – 8:00 PM" },
  { id: 3, day: "Wednesday", time: "5:00 PM – 7:00 PM" },
];
const reviewsList = [
  { id: 1, author: "Noor A.", text: "My daughter lost her fear of water in four sessions." },
  { id: 2, author: "Omar K.", text: "Punctual, patient coach and easy to book." },
  { id: 3, author: "Hana S.", text: "Great value for private lessons." },
];
const makeServices = (price, home) => [
  { id: 1, name: "Private lesson", price: `AED ${price} / session` },
  { id: 2, name: "Group lesson (up to 4)", price: `AED ${Math.round(price * 0.45)} / person` },
  ...(home ? [{ id: 3, name: "Home pool visit", price: "+AED 50" }] : []),
];
const make = (id, name, city, area, rating, reviews, price, distanceKm, levels, lessonTypes, homeVisit, years, lat, lng) => ({
  id, name, city, area, rating, reviews, price, distanceKm, levels, lessonTypes, homeVisit, years, lat, lng,
  services: makeServices(price, homeVisit), schedule, reviewsList,
});

const providers = [
  make(1, "Blue Wave Swim School", "Dubai", "Dubai Sports City", 4.5, 128, 180, 2.0, ["Beginner", "Intermediate"], ["Private", "Group"], true, 8, 25.0407, 55.2181),
  make(3, "Gulf Wave Aquatics", "Abu Dhabi", "Al Reem Island", 4.9, 214, 210, 6.4, ["Intermediate", "Advanced"], ["Private", "Group"], false, 12, 24.4942, 54.4102),
  make(8, "Elite Swim Training", "Abu Dhabi", "Saadiyat Island", 4.9, 176, 250, 8.1, ["Advanced"], ["Private"], false, 15, 24.5388, 54.4449),
  make(24, "Palm Swim Center", "Dubai", "Palm Jumeirah", 4.8, 302, 230, 5.3, ["Beginner", "Intermediate", "Advanced"], ["Private", "Group"], true, 10, 25.112, 55.137),
  make(31, "Al Majaz Aqua Club", "Sharjah", "Al Majaz", 4.4, 96, 140, 1.8, ["Beginner", "Intermediate"], ["Group"], false, 6, 25.3256, 55.3855),
  make(35, "Splash Home Coaching", "Sharjah", "Al Khan", 4.6, 74, 160, 2.2, ["Beginner"], ["Private"], true, 5, 25.3363, 55.3772),
  make(41, "Little Dolphins Academy", "Sharjah", "Muwailih", 4.3, 58, 120, 3.0, ["Beginner"], ["Private", "Group"], true, 4, 25.2917, 55.4468),
];
export default providers;
