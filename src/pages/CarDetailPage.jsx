import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Armchair,
  BadgeInfo,
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Fuel,
  Gauge,
  MessageCircle,
  X,
  Zap,
} from 'lucide-react';
import { fetchCarById } from '../api/cars';
import Header from '../components/Header';
import { formatPrice } from '../utils/formatters';

const fallbackImage =
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000';

const specIcons = {
  Engine: Gauge,
  'Top Speed': Gauge,
  Acceleration: Zap,
  'Fuel Type': Fuel,
  Seats: Armchair,
  Year: Calendar,
};

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchCarById(id);
        setCar(data);
        setActiveImg(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-black text-[#bda588] tracking-[0.2em]"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
        LOADING...
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black">
        <p className="text-sm text-red-400" style={{ fontFamily: '"Montserrat", sans-serif' }}>
          Vehicle not found.
        </p>
        <Link
          to="/models"
          className="border-b border-[#bda588] text-xs uppercase tracking-[0.2em] text-[#bda588] no-underline"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  const images = car.images?.length ? car.images : [fallbackImage];
  const priceText = car.priceDisplay || formatPrice(car.price) || 'Price on Request';
  const specs = [
    { label: 'Engine', value: car.engine },
    { label: 'Top Speed', value: car.topSpeed },
    { label: 'Acceleration', value: car.acceleration },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Seats', value: car.seats },
    { label: 'Year', value: car.year },
  ].filter((spec) => spec.value);

  const goToImage = (direction) => {
    setActiveImg((current) => (current + direction + images.length) % images.length);
  };

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-white">
        <Header />

        <section className="relative overflow-hidden border-b border-white/10 bg-[#070707]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(189,165,136,0.14),transparent_32%),linear-gradient(180deg,#050505_0%,#0b0b0b_100%)]" />

          <div className="relative z-10 mx-auto grid min-h-[86vh] max-w-[1500px] grid-cols-1 gap-10 px-5 pb-10 pt-28 md:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-16 lg:pb-14 lg:pt-32">
            <div className="flex flex-col justify-between">
            <button
              onClick={() => navigate(-1)}
              className="mb-auto inline-flex w-fit items-center gap-2 border border-[rgba(189,165,136,0.36)] bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d8bf97] backdrop-blur-md transition-all duration-300 hover:border-[#d8bf97] hover:bg-[#d8bf97] hover:text-black"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              <ArrowLeft size={14} />
              Back
            </button>

              <div className="mt-16 lg:mt-0">
                <p
                  className="mb-4 text-[10px] uppercase tracking-[0.32em] text-[#d8bf97]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {[car.category, car.year].filter(Boolean).join(' / ')}
                </p>
                <h1
                  className="max-w-4xl text-4xl font-light leading-tight text-white sm:text-5xl md:text-7xl"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {car.name}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {car.brand && (
                    <span
                      className="border border-white/15 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1] backdrop-blur-md"
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {car.brand}
                    </span>
                  )}
                  {car.isFeatured && (
                    <span
                      className="border border-[#d8bf97]/40 bg-[#d8bf97]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d8bf97] backdrop-blur-md"
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      Featured Vehicle
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <p
                  className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#8c8c8c]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Starting from
                </p>
                <p className="text-3xl text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {priceText}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {specs.slice(0, 2).map((spec) => (
                    <div key={spec.label} className="border border-white/10 bg-white/[0.04] p-3">
                      <p
                        className="mb-1 text-[9px] uppercase tracking-[0.18em] text-[#7c7c7c]"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                      >
                        {spec.label}
                      </p>
                      <p className="text-sm text-[#e5e2e1]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="self-end">
              <div className="relative border border-white/10 bg-[#111] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-4">
                <div className="relative flex aspect-[16/10] max-h-[640px] items-center justify-center overflow-hidden bg-black">
                  <img
                    src={images[activeImg]}
                    alt={car.name}
                    className="h-full w-full object-contain transition-opacity duration-500"
                    key={activeImg}
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-between">
                      <button
                        onClick={() => goToImage(-1)}
                        className="flex h-11 w-11 items-center justify-center border border-white/15 bg-black/45 text-[#d8bf97] backdrop-blur-md transition-colors hover:border-[#d8bf97] hover:bg-[#d8bf97] hover:text-black"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => goToImage(1)}
                        className="flex h-11 w-11 items-center justify-center border border-white/15 bg-black/45 text-[#d8bf97] backdrop-blur-md transition-colors hover:border-[#d8bf97] hover:bg-[#d8bf97] hover:text-black"
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((img, index) => (
                      <button
                        key={img}
                        onClick={() => setActiveImg(index)}
                        className={`aspect-[16/10] overflow-hidden border bg-black transition-all duration-300 ${
                          index === activeImg
                            ? 'border-[#d8bf97] opacity-100'
                            : 'border-white/10 opacity-55 hover:opacity-90'
                        }`}
                        aria-label={`Show vehicle image ${index + 1}`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 lg:px-16 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-14">
            <div className="min-w-0">
              <section className="mb-12 border-b border-white/10 pb-10">
                <div
                  className="mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d8bf97]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  <BadgeInfo size={15} />
                  Overview
                </div>
                <p
                  className="max-w-4xl text-[15px] leading-loose text-[#b9b9b9] md:text-base"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {car.description ||
                    'A carefully selected luxury vehicle prepared for private viewing and test drive consultation.'}
                </p>
              </section>

              {specs.length > 0 && (
                <section>
                  <h2
                    className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#d8bf97]"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    Specifications
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {specs.map((spec) => {
                      const Icon = specIcons[spec.label] || BadgeInfo;

                      return (
                        <div
                          key={spec.label}
                          className="group border border-white/10 bg-[#0b0b0b] p-5 transition-colors hover:border-[#d8bf97]/50"
                        >
                          <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#d8bf97]/25 text-[#d8bf97] transition-colors group-hover:bg-[#d8bf97] group-hover:text-black">
                            <Icon size={18} />
                          </div>
                          <p
                            className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#777]"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                          >
                            {spec.label}
                          </p>
                          <p className="text-xl text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
                            {spec.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <aside className="self-start lg:sticky lg:top-28">
              <div className="border border-[rgba(216,191,151,0.24)] bg-[#0c0c0c] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-8">
                <div
                  className="mb-8 h-px w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, #d8bf97, transparent)' }}
                />

                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9d8b73]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Private Concierge
                </p>
                <h2 className="mb-3 text-3xl font-light text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Reserve a personal viewing
                </h2>
                <p className="mb-8 text-sm leading-7 text-[#898989]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Share your details and our team will coordinate a test drive or private walkaround for {car.name}.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex w-full items-center justify-center gap-3 bg-gradient-to-r from-[#e9c176] to-[#a17d39] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#241700] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(233,193,118,0.2)] active:scale-[0.99]"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    <CalendarCheck size={17} />
                    Book Test Drive
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/9987984688', '_blank')}
                    className="flex w-full items-center justify-center gap-3 border border-[rgba(189,165,136,0.65)] px-5 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#d8bf97] transition-all duration-300 hover:bg-[#d8bf97] hover:text-black"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    <MessageCircle size={17} />
                    WhatsApp Us
                  </button>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#777]"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    Vehicle price
                  </p>
                  <p className="text-2xl text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {priceText}
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-3 border border-white/10 bg-white/[0.03] p-4">
                  <CheckCircle2 className="mt-0.5 flex-shrink-0 text-[#d8bf97]" size={17} />
                  <p className="text-[11px] leading-6 text-[#777]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    Private appointment, assisted documentation, and curated finance support available on request.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {showModal && <CarBookingModal car={car} onClose={() => setShowModal(false)} />}
    </>
  );
}

function CarBookingModal({ car, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handle = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError('Name and phone are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { submitBooking } = await import('../api/bookings');
      await submitBooking({
        name: form.name,
        phone: form.phone,
        preferredVehicle: car.name,
        message: form.message,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] border border-[#d8bf97]/70 bg-[#101010] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)] md:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/10 text-[#888] transition-colors hover:border-[#d8bf97] hover:text-[#d8bf97]"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-5 text-[#d8bf97]" size={44} />
            <h3 className="mb-3 text-3xl text-[#d8bf97]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Request Sent
            </h3>
            <p className="mb-7 text-xs leading-6 text-[#888]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              We will contact you shortly to arrange your private viewing.
            </p>
            <button
              onClick={onClose}
              className="border border-[#d8bf97] px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#d8bf97] transition-colors hover:bg-[#d8bf97] hover:text-black"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#9d8b73]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Test Drive Request
            </p>
            <h3
              className="mb-2 pr-10 text-3xl font-light text-[#d8bf97]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Book a private appointment
            </h3>
            <p className="mb-7 text-xs text-[#888]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              {car.name}
            </p>

            <div className="mb-4 flex flex-col gap-4">
              {[
                { key: 'name', label: 'Your Name *', type: 'text' },
                { key: 'phone', label: 'Phone Number *', type: 'tel' },
                { key: 'message', label: 'Message (optional)', type: 'text' },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.key]}
                  onChange={handle(field.key)}
                  className="w-full border border-[#333] bg-black px-4 py-3 text-sm text-[#e5e2e1] transition-colors placeholder:text-[#555] focus:border-[#d8bf97] focus:outline-none"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              ))}
            </div>

            {error && (
              <p className="mb-4 text-xs text-red-400" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#e9c176] to-[#9f7e3a] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#412d00] disabled:opacity-60"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-[#333] py-3 text-xs uppercase tracking-[0.2em] text-[#888] transition-colors hover:border-[#d8bf97] hover:text-[#d8bf97]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
