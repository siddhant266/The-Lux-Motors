// ─── API base URL ────────────────────────────────────────────────────────────
// Update this to point to your backend (e.g. https://yourapi.com)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── helpers ─────────────────────────────────────────────────────────────────
async function apiFetch(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
}

// ─── Normalize a raw DB car document into a consistent shape ─────────────────
export function normalizeCar(raw) {
    return {
        // id: prefer string slug; fall back to MongoDB _id
        id: raw.id || raw._id,
        name: raw.name || 'Unknown',
        brand: raw.brand || '',
        category: raw.category || '',
        year: raw.year || '',
        description: raw.description || '',
        engine: raw.engine || '',
        topSpeed: raw.top_speed || raw.topSpeed || '',
        acceleration: raw.acceleration || '',
        seats: raw.seats ?? null,
        fuelType: raw.fuel_type || raw.fuelType || '',
        // price_display is a string from DB; we prefer it for display
        priceDisplay: raw.price_display || raw.priceDisplay || '',
        // raw numeric price (if present) for sorting / formatters
        price: raw.price ?? null,
        images: Array.isArray(raw.images) ? raw.images : [],
        isFeatured: raw.is_featured ?? raw.isFeatured ?? false,
    };
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** Fetch ALL cars */
export async function fetchAllCars() {
    const data = await apiFetch('/api/cars');
    const cars = Array.isArray(data) ? data : (data.cars || data.data || []);
    return cars.map(normalizeCar);
}

/** Fetch only featured cars */
export async function fetchFeaturedCars() {
    try {
        const data = await apiFetch('/api/cars?featured=true');
        const cars = Array.isArray(data) ? data : (data.cars || data.data || []);
        return cars.map(normalizeCar);
    } catch {
        // Fallback: fetch all and filter client-side
        const all = await fetchAllCars();
        return all.filter(c => c.isFeatured);
    }
}

/** Fetch a single car by id */
export async function fetchCarById(id) {
    const data = await apiFetch(`/api/cars/${id}`);
    return normalizeCar(data);
}

/** Fetch cars by category slug */
export async function fetchCarsByCategory(category) {
    const data = await apiFetch(`/api/cars?category=${encodeURIComponent(category)}`);
    const cars = Array.isArray(data) ? data : (data.cars || data.data || []);
    return cars.map(normalizeCar);
}

// ─── Admin Methods ───────────────────────────────────────────────────────────

export async function createCar(carData, token) {
    const res = await fetch(`${BASE_URL}/api/cars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error('Failed to create car');
    return res.json();
}

export async function updateCar(id, carData, token) {
    const res = await fetch(`${BASE_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error('Failed to update car');
    return res.json();
}

export async function deleteCar(id, token) {
    const res = await fetch(`${BASE_URL}/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete car');
    return res.json();
}
