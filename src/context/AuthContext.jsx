// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]   = useState(null);
    const [token, setToken] = useState(null);

    // Rehydrate from localStorage on first load
    useEffect(() => {
        const storedToken = localStorage.getItem('lux_token');
        const storedUser  = localStorage.getItem('lux_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('lux_token', jwtToken);
        localStorage.setItem('lux_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('lux_token');
        localStorage.removeItem('lux_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
