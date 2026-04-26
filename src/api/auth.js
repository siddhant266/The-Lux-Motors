// src/api/auth.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function loginApi({ email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed.');
    return data; // { token, user }
}
