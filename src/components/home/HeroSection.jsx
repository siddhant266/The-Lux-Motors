// src/components/home/HeroSection.jsx
// Matches your existing Hero.jsx structure:
// – Uses your exact static slides array as the default/fallback
// – When `cars` prop is passed (from DB), uses those instead
// – Same timing logic (4s auto, 7s after manual)
// – Same dot pagination at bottom center
// – Adds slide counter on right (from original design)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Static fallback slides — identical to your original Hero.jsx
const STATIC_SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
        name: 'Porsche 911 Turbo S',
        engine: '3.8L Twin-Turbo Flat-6',
        link: '/car/porsche-911',
    },
    {
        image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=2000',
        name: 'BMW M8 Competition',
        engine: '4.4L Twin-Turbo V8',
        link: '/car/bmw-m8',
    },
    {
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2000',
        name: 'Mercedes-Maybach S-Class',
        engine: '6.0L Bi-Turbo V12',
        link: '/car/mercedes-maybach',
    },
    {
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000',
        name: 'Audi R8 V10 Performance',
        engine: '5.2L Naturally Aspirated V10',
        link: '/car/audi-r8',
    },
    {
        image: 'https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=2070&auto=format&fit=crop',
        name: '1967 Ford Mustang',
        engine: '289-cubic-inch (4.7L) V8',
        link: '/car/1967-ford-mustang',
    },
];

/**
 * HeroSection
 * Props:
 *   cars : Car[] (optional) — DB cars; falls back to STATIC_SLIDES if empty
 */
export default function HeroSection({ cars }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isManualOverride, setIsManualOverride] = useState(false);

    // Build slide list: use DB cars when available, otherwise static fallback
    const slides =
        cars && cars.length > 0
            ? cars.map((c) => ({
                image: c.images?.[0] ?? '',
                name: c.name,
                engine: c.engine ?? c.category ?? '',
                link: `/car/${c.id}`,
            }))
            : STATIC_SLIDES;

    useEffect(() => {
        const delay = isManualOverride ? 7000 : 4000;
        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            setIsManualOverride(false);
        }, delay);
        return () => clearTimeout(timer);
    }, [currentSlide, isManualOverride, slides.length]);

    const handleManualSelect = (index) => {
        setCurrentSlide(index);
        setIsManualOverride(true);
    };

    const current = slides[currentSlide];

    return (
        <div className="relative h-screen w-full bg-black text-white overflow-hidden">

            {/* Shifting background images */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ backgroundImage: `url("${slide.image}")` }}
                />
            ))}

            {/* Dark gradient overlays — your exact gradients */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Hero content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24 max-w-[1920px] mx-auto pointer-events-none">
                <div className="max-w-2xl mt-12 pointer-events-auto">

                    {/* Static headline */}
                    <h1
                        className="text-3xl md:text-6xl font-bold leading-tight mb-8 text-[#f3f4f6]"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        Premium Auto<br />Import &amp; Financing
                    </h1>

                    {/* Dynamic slide info with gold left border */}
                    <div className="mb-10 border-l-2 border-[#bda588] pl-6 py-1">
                        <Link to={current.link} className="group block w-fit no-underline">
                            <h2
                                className="text-2xl font-light tracking-wide text-white group-hover:text-[#bda588] transition-colors"
                                style={{ fontFamily: '"Playfair Display", serif' }}
                            >
                                {current.name}
                            </h2>
                            <p
                                className="text-[#c5c6ca] text-[11px] uppercase tracking-[0.2em] font-medium mt-2"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {current.engine}
                            </p>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Slide counter — right side */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 items-center">
                <span
                    className="text-[#bda588] font-light leading-none"
                    style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px' }}
                >
                    {String(currentSlide + 1).padStart(2, '0')}
                </span>
                <div
                    className="w-px h-16"
                    style={{ background: 'linear-gradient(to bottom, #bda588, transparent)' }}
                />
                <span className="text-[#888] text-[10px] tracking-[0.1em]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    {String(slides.length).padStart(2, '0')}
                </span>
            </div>

            {/* Dot pagination — your exact implementation */}
            <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleManualSelect(index)}
                        className={`w-12 h-[2px] transition-all duration-300 ${index === currentSlide
                                ? 'bg-[#bda588]'
                                : 'bg-white/30 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-12 z-20 flex items-center gap-3">
                <div
                    className="w-px h-10"
                    style={{ background: 'linear-gradient(to bottom, transparent, #bda588)' }}
                />
                <span
                    className="uppercase text-[9px] tracking-[0.25em] text-[#888]"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    Scroll
                </span>
            </div>

        </div>
    );
}