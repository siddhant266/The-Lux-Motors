// src/pages/Homepage.jsx
// Imported in App.jsx as: import HomePage from './pages/Homepage'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCars } from '../hooks/useCars';
import { useReveal } from '../hooks/useReveal';

import Header from '../components/Header';
import HeroSection from '../components/home/HeroSection';
import MarqueeStrip from '../components/home/MarqueeStrip';
import StatsSection from '../components/home/StatsSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedSection from '../components/home/FeaturedSection';
import ExperienceSection from '../components/home/ExperienceSection';
import TestDriveCTA from '../components/home/TestDriveCTA';
import Footer from '../components/home/Footer';
import BookingModal from '../components/home/BookingModal';



export default function HomePage() {
    const [showModal, setShowModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { allCars, featuredCars, loading, error } = useCars();

    useReveal(!loading);

    useEffect(() => {
        if (searchParams.get('bookTestDrive') !== '1') return;

        setShowModal(true);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('bookTestDrive');
        setSearchParams(nextParams, { replace: true });
    }, [searchParams, setSearchParams]);

    if (loading) {
        return (
            <div
                className="min-h-screen bg-black flex items-center justify-center text-[#bda588] tracking-[0.2em]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
                LOADING COLLECTION...
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-black flex items-center justify-center text-red-500"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
                Error loading vehicles: {error}
            </div>
        );
    }

    // Top 5 featured cars go to the hero slideshow
    const heroCars = featuredCars.slice(0, 5);

    return (
        <>
            {/* grain overlay lives on this wrapper div */}
            <div className="grain">
                <Header onBookTestDrive={() => setShowModal(true)} />

                <HeroSection cars={heroCars} />

                   <StatsSection />

                <MarqueeStrip />

             

                <CategoriesSection cars={allCars} />

                <FeaturedSection cars={featuredCars} />

                <ExperienceSection />

                <TestDriveCTA openModal={() => setShowModal(true)} />

                <Footer />
            </div>

            {showModal && <BookingModal onClose={() => setShowModal(false)} />}
        </>
    );
}
