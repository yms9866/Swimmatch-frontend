const API_BASE = "https://swimmatch.onrender.com";

export async function getJson(path, signal) {
  const response = await fetch(`${API_BASE}${path}`, { signal });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export async function getProviders(signal, filters = {}) {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location.trim());
  if (filters.level) params.set("level", filters.level.toLowerCase());
  if (filters.type) params.set("type", filters.type.toLowerCase());
  if (filters.budget) params.set("max_price", filters.budget);
  if (filters.day) params.set("day", filters.day);
  if (filters.where) params.set("visit", filters.where);
  const query = params.size ? `?${params}` : "";
  const [providerData, serviceData] = await Promise.all([
    getJson(`/api/providers${query}`, signal),
    getJson("/api/services", signal),
  ]);
  if (!Array.isArray(providerData.providers) || !Array.isArray(serviceData.services)) {
    throw new Error("Unexpected API response");
  }
  const servicesByProvider = new Map();
  for (const service of serviceData.services) {
    const items = servicesByProvider.get(service.provider_id) || [];
    items.push(service);
    servicesByProvider.set(service.provider_id, items);
  }
  return providerData.providers.map((provider) => ({
    ...provider,
    city: provider.location?.city || "",
    area: provider.location?.area || "",
    services: servicesByProvider.get(provider.id) || [],
  }));
}

export async function getProvider(id, signal) {
  return getJson(`/api/providers/${encodeURIComponent(id)}`, signal);
}

export async function getProviderSummaries(signal) {
  const data = await getJson("/api/providers", signal);
  if (!Array.isArray(data.providers)) throw new Error("Unexpected provider response");
  return data.providers;
}

export async function getAvailability(id, signal) {
  const data = await getJson(`/api/providers/${encodeURIComponent(id)}/availability`, signal);
  if (!Array.isArray(data.availability)) throw new Error("Unexpected availability response");
  return data.availability;
}

export async function getInstructors(providerId, signal) {
  const data = await getJson(`/api/instructors?provider_id=${encodeURIComponent(providerId)}`, signal);
  if (!Array.isArray(data.instructors)) throw new Error("Unexpected instructors response");
  return data.instructors;
}

export async function getServices(signal) {
  const data = await getJson("/api/services", signal);
  if (!Array.isArray(data.services)) throw new Error("Unexpected services response");
  return data.services;
}

export async function getAllInstructors(signal) {
  const data = await getJson("/api/instructors", signal);
  if (!Array.isArray(data.instructors)) throw new Error("Unexpected instructors response");
  return data.instructors;
}

export async function getBookings(signal) {
  const data = await getJson("/api/bookings", signal);
  if (!Array.isArray(data.bookings)) throw new Error("Unexpected bookings response");
  return data.bookings;
}

export function getProfile(signal) {
  return getJson("/api/profile", signal);
}


export function filterProviders(providers, filters) {
  const location = filters.location.trim().toLowerCase();
  return providers.filter((provider) => {
    if (location && !`${provider.name} ${provider.city} ${provider.area}`.toLowerCase().includes(location)) return false;
    return provider.services.some((service) =>
      (!filters.level || service.level === filters.level.toLowerCase()) &&
      (!filters.type || service.type === filters.type.toLowerCase()) &&
      (!filters.budget || service.price <= Number(filters.budget))
    );
  });
}

export function matchingPrice(provider, filters = {}) {
  const prices = provider.services
    .filter((service) =>
      (!filters.level || service.level === filters.level.toLowerCase()) &&
      (!filters.type || service.type === filters.type.toLowerCase()) &&
      (!filters.budget || service.price <= Number(filters.budget))
    )
    .map((service) => service.price);
  return prices.length ? Math.min(...prices) : null;
}
