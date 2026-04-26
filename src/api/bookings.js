// src/api/bookings.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Public — submit a test drive booking */
export async function submitBooking({ name, phone, preferredVehicle, message }) {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone, preferredVehicle, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit booking.');
    return data;
}

/** Admin only — fetch all bookings */
export async function fetchBookings(token) {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings.');
    return data;
}

/** Admin only — update booking status */
export async function updateBookingStatus(id, status, token) {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status.');
    return data;
}
