// src/components/home/BookingModal.jsx
import { useState } from 'react';
import { submitBooking } from '../../api/bookings';

/**
 * Props:
 *   onClose : () => void
 */
export default function BookingModal({ onClose }) {
    const [form, setForm]     = useState({ name: '', phone: '', preferredVehicle: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]   = useState('');

    const handle = field => e => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            setError('Name and phone number are required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await submitBooking(form);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div
                className="bg-[#111] border border-[#bda588] p-10 w-full max-w-[500px] flex flex-col gap-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                onClick={e => e.stopPropagation()}
            >
                {success ? (
                    /* ── Success State ── */
                    <div className="text-center py-8 flex flex-col items-center gap-5">
                        <div className="w-14 h-14 rounded-full border border-[#bda588] flex items-center justify-center text-2xl text-[#bda588]">
                            ✓
                        </div>
                        <h3
                            className="text-2xl font-light text-[#bda588]"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            Request Received!
                        </h3>
                        <p
                            className="text-xs text-[#888] leading-loose max-w-[300px]"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                            Our concierge team will reach out to you shortly to arrange your private test drive.
                        </p>
                        <button
                            onClick={onClose}
                            className="border border-[#bda588] text-[#bda588] px-10 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#bda588] hover:text-black transition-all duration-300"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* ── Form State ── */
                    <>
                        <div>
                            <h3
                                className="text-[28px] font-light text-[#bda588]"
                                style={{ fontFamily: '"Playfair Display", serif' }}
                            >
                                Book a Test Drive
                            </h3>
                            <p
                                className="text-xs text-[#888] mt-1"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                Fill in the form below or contact us via WhatsApp.
                            </p>
                        </div>

                        {/* Fields */}
                        {[
                            { key: 'name',             placeholder: 'Your Name *',          type: 'text' },
                            { key: 'phone',            placeholder: 'Phone Number *',        type: 'tel'  },
                            { key: 'preferredVehicle', placeholder: 'Preferred Vehicle',     type: 'text' },
                            { key: 'message',          placeholder: 'Message (optional)',    type: 'text' },
                        ].map(f => (
                            <input
                                key={f.key}
                                type={f.type}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={handle(f.key)}
                                className="w-full px-3 py-3 bg-black border border-[#333] text-[#e5e2e1] focus:outline-none focus:border-[#bda588] transition-colors duration-200 placeholder:text-[#555]"
                                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '13px' }}
                            />
                        ))}

                        {/* Error */}
                        {error && (
                            <p
                                className="text-[11px] text-red-400 -mt-2"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {error}
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4 mt-2">
                            <button
                                className="flex-1 bg-gradient-to-r from-[#e9c176] to-[#9f7e3a] text-[#412d00] py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 active:scale-[0.99] disabled:opacity-60"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Submit Request'}
                            </button>
                            <button
                                className="flex-1 border border-[#bda588] text-[#bda588] py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#bda588] hover:text-black"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                                onClick={() => window.open('https://wa.me/9987984688', '_blank')}
                            >
                                WhatsApp Us
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
