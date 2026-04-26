// src/components/Header.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Models', to: '/models' },
  { label: 'Lifestyle', to: '#' },
  { label: 'Heritage', to: '#' },
];

export default function Header({ onBookTestDrive }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const handleBookTestDrive = () => {
    if (onBookTestDrive) {
      onBookTestDrive();
      return;
    }

    navigate('/?bookTestDrive=1');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'border-b border-[rgba(189,165,136,0.14)] bg-[rgba(5,5,5,0.88)] backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.28)]'
          : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1920px] items-center justify-between transition-all duration-300 ${
          isScrolled || !isHomePage ? 'px-6 py-4 md:px-12' : 'px-6 py-6 md:px-12 xl:px-20'
        }`}
      >
        <Link
          to="/"
          className="text-xl font-light tracking-[0.3em] text-[#e5e2e1] no-underline md:text-2xl"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          THE LUX
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 no-underline ${
                location.pathname === to
                  ? 'text-[#e9c176] font-semibold'
                  : 'text-[#c5c6ca] hover:text-[#e9c176]'
              }`}
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleBookTestDrive}
          className="rounded-lg bg-gradient-to-r from-[#e9c176] to-[#9f7e3a] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#412d00] transition-all duration-300 active:scale-[0.99] active:opacity-80 md:px-8"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          Book a Test Drive
        </button>
      </div>
    </header>
  );
}
