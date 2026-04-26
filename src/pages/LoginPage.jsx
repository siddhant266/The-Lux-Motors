import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { styled, keyframes } from '@stitches/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' }
});

const bgFloat = keyframes({
  '0%, 100%': { transform: 'scale(1.04) translateY(0)' },
  '50%': { transform: 'scale(1.04) translateY(-6px)' }
});

const PageContainer = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: '#090909',
  color: '#F5F0E8',
  fontFamily: '"Montserrat", sans-serif',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  }
});

const ImagePanel = styled('div', {
  flex: '0 0 55%',
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    display: 'none',
  }
});

const BgImage = styled('div', {
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animation: `${bgFloat} 12s ease-in-out infinite`,
});

const FormPanel = styled('div', {
  flex: '1',
  backgroundColor: '#0f0f0f',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
  position: 'relative',
  borderLeft: '1px solid #1a1a1a',
  '@media (max-width: 768px)': {
    borderLeft: 'none',
    minHeight: '100vh',
  }
});

const Input = styled('input', {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #1a1a1a',
  color: '#F5F0E8',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: '13px',
  letterSpacing: '0.05em',
  padding: '12px 0',
  outline: 'none',
  transition: 'border-color 0.3s',
  '&:focus': {
    borderBottomColor: '#C9A84C',
  },
  '&::placeholder': {
    color: '#666',
    letterSpacing: '0.1em',
    fontSize: '11px',
  },
  variants: {
    hasError: {
      true: {
        borderBottomColor: '#e05555',
      }
    }
  }
});

const Button = styled(motion.button, {
  width: '100%',
  background: 'linear-gradient(110deg, #9f7e3a 0%, #e9c176 40%, #9f7e3a 60%, #e9c176 100%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 3s linear infinite`,
  color: '#2a1d00',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: '11px',
  letterSpacing: '0.2em',
  fontWeight: 700,
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  }
});

const Label = styled('label', {
  display: 'block',
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '0.25em',
  fontSize: '9px',
  textTransform: 'uppercase',
  marginBottom: '8px',
  color: '#666',
  variants: {
    hasError: {
      true: {
        color: '#e05555',
      }
    }
  }
});

const ErrorText = styled(motion.p, {
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '0.05em',
  fontSize: '10px',
  color: '#e05555',
  marginTop: '4px',
  margin: 0,
});

const StyledLink = styled(Link, {
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '0.15em',
  fontSize: '11px',
  textTransform: 'uppercase',
  color: '#666',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.2s',
  '&:hover': {
    color: '#F5F0E8'
  }
});

const BG_IMAGE = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1600';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAdmin } = useAuth();

    const [form, setForm] = useState({ email: 'admin@thelux.com', password: 'thelux2024' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (isAdmin) navigate('/admin/dashboard', { replace: true });
    }, [isAdmin, navigate]);

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
        <PageContainer>
            <ImagePanel>
                <BgImage style={{ backgroundImage: `url(${BG_IMAGE})` }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,9,0.1) 0%, rgba(9,9,9,0.8) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,9,0.9) 0%, transparent 60%)' }} />
                
                <div style={{ position: 'absolute', top: '48px', left: '48px', zIndex: 2 }}>
                    <Link to="/" style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.35em', fontWeight: 300, fontSize: '20px', color: '#F5F0E8', textDecoration: 'none' }}>
                        THE LUX
                    </Link>
                </div>

                <div style={{ position: 'absolute', bottom: '60px', left: '48px', right: '80px', zIndex: 2 }}>
                    <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C', marginBottom: '20px' }} />
                    <blockquote style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300, lineHeight: 1.35, color: '#F5F0E8', marginBottom: '16px', fontStyle: 'italic' }}>
                        "The cars we drive say<br />a lot about who we are."
                    </blockquote>
                    <cite style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.25em', fontSize: '10px', textTransform: 'uppercase', color: '#C9A84C', fontStyle: 'normal' }}>
                        Alexandra Paul
                    </cite>
                </div>
                
                {/* Decorative border elements */}
                <div style={{ position: 'absolute', top: '40px', right: '40px', width: '40px', height: '40px', borderTop: '1px solid rgba(201,168,76,0.4)', borderRight: '1px solid rgba(201,168,76,0.4)' }} />
                <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '40px', height: '40px', borderBottom: '1px solid rgba(201,168,76,0.4)', borderLeft: '1px solid rgba(201,168,76,0.4)' }} />
            </ImagePanel>

            <FormPanel>
                {/* Subtle top gradient line */}
                <div style={{ position: 'absolute', top: 0, left: '64px', right: '64px', height: '2px', opacity: 0.5, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ width: '100%', maxWidth: '380px' }}
                >
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '24px', height: '1px', backgroundColor: '#C9A84C' }} />
                            <span style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.3em', fontSize: '10px', textTransform: 'uppercase', color: '#C9A84C' }}>
                                Admin Portal
                            </span>
                        </div>
                        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.1, color: '#F5F0E8', marginBottom: '12px', margin: 0 }}>
                            Welcome Back
                        </h1>
                        <p style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.8, fontSize: '12px', color: '#666', margin: 0, marginTop: '12px' }}>
                            Sign in to manage your luxury vehicle listings and enquiries.
                        </p>
                    </div>

                    <AnimatePresence>
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ padding: '12px 16px', border: '1px solid rgba(224, 85, 85, 0.4)', backgroundColor: 'rgba(224, 85, 85, 0.1)' }}>
                                    <p style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em', fontSize: '11px', color: '#e05555', margin: 0 }}>
                                        {apiError}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
                        <div>
                            <Label hasError={!!errors.email}>Email Address</Label>
                            <Input
                                hasError={!!errors.email}
                                type="email"
                                placeholder="admin@thelux.com"
                                value={form.email}
                                onChange={handle('email')}
                                onKeyDown={onKey}
                            />
                            <div style={{ minHeight: '16px' }}>
                                <AnimatePresence>
                                    {errors.email && (
                                        <ErrorText initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                            {errors.email}
                                        </ErrorText>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Label style={{ marginBottom: 0 }} hasError={!!errors.password}>Password</Label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Input
                                    hasError={!!errors.password}
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={form.password}
                                    onChange={handle('password')}
                                    onKeyDown={onKey}
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px', display: 'flex', alignItems: 'center', outline: 'none' }}
                                >
                                    {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>
                            <div style={{ minHeight: '16px' }}>
                                <AnimatePresence>
                                    {errors.password && (
                                        <ErrorText initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                            {errors.password}
                                        </ErrorText>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Loader2 size={16} />
                                </motion.div>
                                Authenticating...
                            </>
                        ) : (
                            'Access Dashboard →'
                        )}
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a1a' }} />
                        <span style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.15em', fontSize: '10px', textTransform: 'uppercase', color: '#666' }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a1a' }} />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <StyledLink to="/">
                            <ArrowLeft size={14} /> Return to Showroom
                        </StyledLink>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #1a1a1a' }}>
                        <p style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em', fontSize: '10px', color: '#444', textAlign: 'center', lineHeight: 1.8, margin: 0 }}>
                            Default: admin@thelux.com / thelux2024<br />
                            <span style={{ color: '#333' }}>(Run /api/auth/seed-admin once to create)</span>
                        </p>
                    </div>
                </motion.div>

                <p style={{ position: 'absolute', bottom: '32px', fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.1em', fontSize: '10px', color: '#1a1a1a', textAlign: 'center', margin: 0 }}>
                    THE LUX · Admin Portal · v2.0
                </p>
            </FormPanel>
        </PageContainer>
    );
}