// src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBookings, updateBookingStatus } from '../api/bookings';
import AdminCarsPanel from '../components/AdminCarsPanel';

const STATUS_COLORS = {
    pending:   'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
    confirmed: 'text-green-400 border-green-400/40 bg-green-400/10',
    cancelled: 'text-red-400 border-red-400/40 bg-red-400/10',
};

export default function AdminDashboard() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [activeTab, setActiveTab]   = useState('bookings');
    const [updating, setUpdating]     = useState(null);

    const loadBookings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchBookings(token);
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    async function handleStatusChange(id, status) {
        setUpdating(id);
        try {
            const updated = await updateBookingStatus(id, status, token);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: updated.status } : b));
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdating(null);
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const stats = {
        total:     bookings.length,
        pending:   bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>

            {/* ── Sidebar ── */}
            <div className="flex">
                <aside className="w-64 min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col fixed top-0 left-0 bottom-0 z-40">
                    {/* Logo */}
                    <div className="px-8 py-8 border-b border-[#1a1a1a]">
                        <div className="text-xl tracking-[0.3em] text-[#e5e2e1] font-light"
                            style={{ fontFamily: '"Playfair Display", serif' }}>
                            THE LUX
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#bda588] mt-1">
                            Admin Portal
                        </p>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-8 px-4">
                        {[
                            { id: 'cars', label: 'Car Inventory', icon: '🚗' },
                            { id: 'bookings', label: 'Test Drive Bookings', icon: '📋' },
                            { id: 'overview', label: 'Overview',             icon: '📊' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[11px] uppercase tracking-[0.15em] mb-1 transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-[#bda588]/10 text-[#bda588] border-l-2 border-[#bda588]'
                                        : 'text-[#666] hover:text-[#aaa] hover:bg-white/5'
                                }`}
                            >
                                <span>{item.icon}</span> {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User + Logout */}
                    <div className="px-6 py-6 border-t border-[#1a1a1a]">
                        <p className="text-[11px] text-[#888] mb-1">{user?.name}</p>
                        <p className="text-[10px] text-[#555] mb-4">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full border border-[#333] text-[#888] py-2.5 text-[10px] uppercase tracking-[0.15em] hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
                        >
                            Log Out
                        </button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="ml-64 flex-1 min-h-screen">

                    {/* Header bar */}
                    <div className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur border-b border-[#1a1a1a] px-10 py-5 flex justify-between items-center">
                        <div>
                            <h1 className="text-lg text-[#f3f4f6] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
                                {activeTab === 'bookings' ? 'Test Drive Bookings' : activeTab === 'cars' ? 'Car Inventory' : 'Overview'}
                            </h1>
                            <p className="text-[10px] text-[#555] mt-0.5 uppercase tracking-[0.1em]">
                                The Lux Admin
                            </p>
                        </div>
                        <button
                            onClick={loadBookings}
                            className="text-[10px] uppercase tracking-[0.15em] text-[#bda588] border border-[rgba(189,165,136,0.3)] px-4 py-2 hover:bg-[#bda588]/10 transition-all duration-200"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    <div className="px-10 py-10">

                        {/* ── Overview Tab ── */}
                        {activeTab === 'overview' && (
                            <div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                    {[
                                        { label: 'Total Bookings', value: stats.total,     color: '#bda588' },
                                        { label: 'Pending',        value: stats.pending,   color: '#facc15' },
                                        { label: 'Confirmed',      value: stats.confirmed, color: '#4ade80' },
                                        { label: 'Cancelled',      value: stats.cancelled, color: '#f87171' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#555] mb-3">{s.label}</p>
                                            <p className="text-4xl font-light" style={{ color: s.color, fontFamily: '"Playfair Display", serif' }}>
                                                {s.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[12px] text-[#555]">More analytics coming soon.</p>
                            </div>
                        )}

                        {/* ── Cars Tab ── */}
                        {activeTab === 'cars' && <AdminCarsPanel />}

                        {/* ── Bookings Tab ── */}
                        {activeTab === 'bookings' && (
                            <>
                                {loading ? (
                                    <div className="text-[#bda588] tracking-[0.2em] text-sm py-20 text-center">
                                        LOADING BOOKINGS...
                                    </div>
                                ) : error ? (
                                    <div className="text-red-400 text-sm py-10">{error}</div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-[#555] text-sm">No bookings yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#1a1a1a]">
                                                    {['Name', 'Phone', 'Vehicle', 'Message', 'Date', 'Status', 'Action'].map(h => (
                                                        <th key={h} className="pb-4 pr-6 text-[9px] uppercase tracking-[0.2em] text-[#555] font-normal">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map(b => (
                                                    <tr key={b._id} className="border-b border-[#111] hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-5 pr-6 text-[13px] text-[#e5e2e1]">{b.name}</td>
                                                        <td className="py-5 pr-6 text-[12px] text-[#aaa]">{b.phone}</td>
                                                        <td className="py-5 pr-6 text-[12px] text-[#bda588] max-w-[140px] truncate">{b.preferredVehicle || '—'}</td>
                                                        <td className="py-5 pr-6 text-[12px] text-[#666] max-w-[180px] truncate">{b.message || '—'}</td>
                                                        <td className="py-5 pr-6 text-[11px] text-[#555]">
                                                            {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="py-5 pr-6">
                                                            <span className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border ${STATUS_COLORS[b.status]}`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-5">
                                                            <select
                                                                value={b.status}
                                                                disabled={updating === b._id}
                                                                onChange={e => handleStatusChange(b._id, e.target.value)}
                                                                className="bg-[#111] border border-[#333] text-[#888] text-[11px] px-2 py-1.5 uppercase tracking-[0.1em] cursor-pointer focus:outline-none focus:border-[#bda588] disabled:opacity-40"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="confirmed">Confirmed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
