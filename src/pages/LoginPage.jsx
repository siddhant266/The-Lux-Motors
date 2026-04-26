import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

/* ── Fonts + keyframes ── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

  :root {
    --gold:  #C9A84C;
    --gold2: #e9c176;
    --cream: #F5F0E8;
    --dark:  #090909;
    --dark2: #0f0f0f;
    --dark3: #1a1a1a;
    --muted: #666;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans:  'Montserrat', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--dark); color: var(--cream); font-family: var(--sans); overflow-x: hidden; }

  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes grain    { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 30%{transform:translate(3%,2%)} 50%{transform:translate(-1%,4%)} 70%{transform:translate(4%,-2%)} 90%{transform:translate(-3%,1%)} }
  @keyframes spinDot  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes shakeX   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
  @keyframes bgFloat  { 0%,100%{transform:scale(1.04) translateY(0)} 50%{transform:scale(1.04) translateY(-6px)} }

  .grain-overlay::after {
    content:''; position:fixed; inset:-50%; width:200%; height:200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    pointer-events:none; z-index:999; animation: grain 8s steps(1) infinite; opacity:.4;
  }

  .btn-gold-full {
    width: 100%;
    background: linear-gradient(110deg, #9f7e3a 0%, #e9c176 40%, #9f7e3a 60%, #e9c176 100%);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
    color: #2a1d00;
    font-family: var(--sans);
    font-size: 11px;
    letter-spacing: .2em;
    font-weight: 700;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    padding: 16px;
    transition: transform .2s, opacity .2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .btn-gold-full:hover { transform: scale(1.01); }
  .btn-gold-full:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .spinner {
    width:14px; height:14px;
    border: 2px solid rgba(42,29,0,.3);
    border-top-color: #2a1d00;
    border-radius: 50%;
    display: inline-block;
    animation: spinDot .7s linear infinite;
  }

  .bg-float { animation: bgFloat 12s ease-in-out infinite; }
  .shake { animation: shakeX .4s ease; }

  .login-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--dark3);
    color: var(--cream);
    font-family: var(--sans);
    font-size: 13px;
    letter-spacing: .05em;
    padding: 12px 0;
    outline: none;
    transition: border-color .3s;
  }
  .login-input:focus { border-bottom-color: var(--gold); }
  .login-input::placeholder { color: var(--muted); letter-spacing: .1em; font-size: 11px; }
  .login-input.error { border-bottom-color: #e05555; }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:var(--gold); }
`;

const BG_IMAGE = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1600';

export default function LoginPage() {
    const navigate  = useNavigate();
    const { login, isAdmin } = useAuth();

    const [form, setForm]       = useState({ email: '', password: '' });
    const [errors, setErrors]   = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [shake, setShake]     = useState(false);

    // If already logged in, redirect straight to dashboard
    useEffect(() => {
        if (isAdmin) navigate('/admin/dashboard', { replace: true });
    }, [isAdmin, navigate]);

    useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 6) e.password = 'Minimum 6 characters';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);
        setErrors({});
        setApiError('');

        try {
            const { token, user } = await loginApi({ email: form.email, password: form.password });
            login(user, token);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setApiError(err.message);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const handle = field => e => {
        setForm(p => ({ ...p, [field]: e.target.value }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
        if (apiError) setApiError('');
    };

    const onKey = e => { if (e.key === 'Enter') handleSubmit(); };

    return (
        <>
            <style>{GLOBAL_STYLES}</style>

            <div className="grain-overlay min-h-screen flex">
                {/* ── LEFT: decorative image panel ── */}
                <div className="flex-[0_0_55%] relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-float"
                        style={{ backgroundImage: `url(${BG_IMAGE})`, transform: 'scale(1.04)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(9,9,9,.1) 0%, rgba(9,9,9,.7) 100%)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,9,.8) 0%, transparent 60%)' }} />

                    <div className="absolute top-12 left-12 z-[2]">
                        <Link
                            to="/"
                            style={{ fontFamily: 'var(--serif)', letterSpacing: '.35em', fontWeight: 300 }}
                            className="text-[20px] text-[var(--cream)] no-underline"
                        >
                            THE LUX
                        </Link>
                    </div>

                    <div className="absolute bottom-[60px] left-12 right-20 z-[2]">
                        <div className="w-8 h-px bg-[var(--gold)] mb-5" />
                        <blockquote
                            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.4rem,2vw,2rem)', fontWeight: 300, lineHeight: 1.35 }}
                            className="italic text-[var(--cream)] mb-4"
                        >
                            "The cars we drive say<br />a lot about who we are."
                        </blockquote>
                        <cite
                            style={{ fontFamily: 'var(--sans)', letterSpacing: '.25em' }}
                            className="text-[10px] uppercase text-[var(--gold)] not-italic"
                        >
                            Alexandra Paul
                        </cite>
                    </div>

                    <div className="absolute top-10 right-10 w-10 h-10 border-t border-r border-[rgba(201,168,76,.4)]" />
                    <div className="absolute bottom-10 left-10 w-10 h-10 border-b border-l border-[rgba(201,168,76,.4)]" />
                </div>

                {/* ── RIGHT: login form ── */}
                <div className="flex-[0_0_45%] bg-[var(--dark2)] flex flex-col justify-center items-center px-16 py-[60px] relative border-l border-[var(--dark3)]">
                    <div
                        className="absolute top-0 left-16 right-16 h-[2px] opacity-50"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
                    />

                    <div
                        className={`w-full max-w-[380px] transition-all duration-[800ms] ease-out ${shake ? 'shake' : ''}`}
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'none' : 'translateY(24px)',
                        }}
                    >
                        {/* Heading */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-px bg-[var(--gold)]" />
                                <span
                                    style={{ fontFamily: 'var(--sans)', letterSpacing: '.3em' }}
                                    className="text-[10px] uppercase text-[var(--gold)]"
                                >
                                    Admin Portal
                                </span>
                            </div>
                            <h1
                                style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,3vw,2.8rem)', fontWeight: 300, lineHeight: 1.1 }}
                                className="text-[var(--cream)] mb-3"
                            >
                                Welcome Back
                            </h1>
                            <p
                                style={{ fontFamily: 'var(--sans)', lineHeight: 1.8 }}
                                className="text-[12px] text-[var(--muted)]"
                            >
                                Sign in to manage your luxury vehicle listings and enquiries.
                            </p>
                        </div>

                        {/* API-level error (wrong credentials) */}
                        {apiError && (
                            <div className="mb-6 px-4 py-3 border border-[#e05555]/40 bg-[#e05555]/10">
                                <p style={{ fontFamily: 'var(--sans)', letterSpacing: '.05em' }}
                                    className="text-[11px] text-[#e05555]">
                                    {apiError}
                                </p>
                            </div>
                        )}

                        {/* Fields */}
                        <div className="flex flex-col gap-8 mb-10">
                            {/* Email */}
                            <div>
                                <label
                                    style={{ fontFamily: 'var(--sans)', letterSpacing: '.25em' }}
                                    className={`block text-[9px] uppercase mb-2 ${errors.email ? 'text-[#e05555]' : 'text-[var(--muted)]'}`}
                                >
                                    Email Address
                                </label>
                                <input
                                    className={`login-input${errors.email ? ' error' : ''}`}
                                    type="email"
                                    placeholder="admin@thelux.com"
                                    value={form.email}
                                    onChange={handle('email')}
                                    onKeyDown={onKey}
                                />
                                {errors.email && (
                                    <p style={{ fontFamily: 'var(--sans)', letterSpacing: '.05em' }} className="text-[10px] text-[#e05555] mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        style={{ fontFamily: 'var(--sans)', letterSpacing: '.25em' }}
                                        className={`text-[9px] uppercase ${errors.password ? 'text-[#e05555]' : 'text-[var(--muted)]'}`}
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className={`login-input pr-8${errors.password ? ' error' : ''}`}
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••••"
                                        value={form.password}
                                        onChange={handle('password')}
                                        onKeyDown={onKey}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(p => !p)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[14px] text-[var(--muted)] p-1 hover:text-[var(--gold)] transition-colors duration-200"
                                    >
                                        {showPass ? '●' : '○'}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p style={{ fontFamily: 'var(--sans)', letterSpacing: '.05em' }} className="text-[10px] text-[#e05555] mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button className="btn-gold-full" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Authenticating...
                                </>
                            ) : (
                                'Access Dashboard →'
                            )}
                        </button>

                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-[var(--dark3)]" />
                            <span
                                style={{ fontFamily: 'var(--sans)', letterSpacing: '.15em' }}
                                className="text-[10px] uppercase text-[var(--muted)]"
                            >
                                or
                            </span>
                            <div className="flex-1 h-px bg-[var(--dark3)]" />
                        </div>

                        <div className="text-center">
                            <Link
                                to="/"
                                style={{ fontFamily: 'var(--sans)', letterSpacing: '.15em' }}
                                className="text-[11px] uppercase text-[var(--muted)] no-underline hover:text-[var(--cream)] transition-colors duration-200"
                            >
                                ← Return to Showroom
                            </Link>
                        </div>

                        {/* Default credentials hint */}
                        <div className="mt-8 pt-6 border-t border-[var(--dark3)]">
                            <p style={{ fontFamily: 'var(--sans)', letterSpacing: '.05em' }}
                                className="text-[10px] text-[#444] text-center leading-loose">
                                Default: admin@thelux.com / thelux2024<br />
                                <span className="text-[#333]">(Run /api/auth/seed-admin once to create)</span>
                            </p>
                        </div>
                    </div>

                    <p
                        style={{ fontFamily: 'var(--sans)', letterSpacing: '.1em' }}
                        className="absolute bottom-8 text-[10px] text-[var(--dark3)] text-center"
                    >
                        THE LUX · Admin Portal · v2.0
                    </p>
                </div>
            </div>
        </>
    );
}