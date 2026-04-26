import { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
    name: 'Porsche 911 Turbo S',
    engine: '3.8L Twin-Turbo Flat-6',
    link: '/car/porsche-911'
  },
  {
    image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=2000',
    name: 'BMW M8 Competition',
    engine: '4.4L Twin-Turbo V8',
    link: '/car/bmw-m8'
  },
  {
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2000',
    name: 'Mercedes-Maybach S-Class',
    engine: '6.0L Bi-Turbo V12',
    link: '/car/mercedes-maybach'
  },
  {
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000',
    name: 'Audi R8 V10 Performance',
    engine: '5.2L Naturally Aspirated V10',
    link: '/car/audi-r8'
  },
  {
    image: 'https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: '1967 Ford Mustang',
    engine: '289-cubic-inch (4.7L) V8',
    link: '/car/1967-ford-mustang'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManualOverride, setIsManualOverride] = useState(false);

  useEffect(() => {
    // If user clicked manually, wait 10s, else wait 5s
    const delay = isManualOverride ? 7000 : 4000;

    const timer = setTimeout(() => {
      setCurrentSlide((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
      // Reset manual override so the next auto-slide is 6s
      setIsManualOverride(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentSlide, isManualOverride]);

  const handleManualSelect = (index) => {
    setCurrentSlide(index);
    setIsManualOverride(true);
  };

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">


      {/* Shifting Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.name}
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url("${slide.image}")` }}
        />
      ))}

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24 max-w-[1920px] mx-auto pointer-events-none">
        <div className="max-w-2xl mt-12 pointer-events-auto">
          <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-8 text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Premium Auto<br />Import & Financing
          </h1>

          <div className="mb-10 border-l-2 border-[#bda588] pl-6 py-1">
            <a href={slides[currentSlide].link} className="group block w-fit">
              <h2 className="text-2xl font-light tracking-wide text-white group-hover:text-[#bda588] transition-colors" style={{ fontFamily: '"Playfair Display", serif' }}>
                {slides[currentSlide].name}
              </h2>
              <p className="text-[#c5c6ca] text-[11px] uppercase tracking-[0.2em] font-medium mt-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                {slides[currentSlide].engine}
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Dots Pagination */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualSelect(index)}
            className={`w-12 h-[2px] transition-all duration-300 ${index === currentSlide ? 'bg-[#bda588]' : 'bg-white/30 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
