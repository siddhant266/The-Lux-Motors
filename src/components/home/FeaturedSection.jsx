// src/components/home/FeaturedSection.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const FILTERS = ['All', 'Vintage', 'Sports', 'Sedan', 'Adventure', 'Ultra Luxury'];

/**
 * Props:
 *   cars : Car[] — normalised car objects from useCars hook
 */
export default function FeaturedSection({ cars }) {
  const [filter, setFilter] = useState('All');

  const shown =
    filter === 'All'
      ? cars
      : cars.filter((c) => c.category?.toLowerCase() === filter.toLowerCase());

  return (
    <section className="py-24 px-12 md:px-24 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">

        {/* Heading row */}
        <div className="reveal flex justify-between items-end mb-10 flex-wrap gap-6">
          <div>
            <span
              className="uppercase tracking-[0.3em] text-[10px] text-[#bda588]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Hand-Picked Selection
            </span>
            <h2
              className="font-light text-[#f3f4f6] mt-3"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem,4vw,3.2rem)' }}
            >
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/models"
            className="text-[10px] uppercase tracking-[0.2em] text-[#bda588] no-underline border-b border-[#bda588] pb-0.5 hover:opacity-70 transition-opacity"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            View All →
          </Link>
        </div>

        {/* Filter pills — matches your CategoryPage style */}
        <div className="reveal flex gap-2.5 flex-wrap mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-xs uppercase tracking-wider transition-colors border ${
                filter === f
                  ? 'border-[#bda588] text-[#bda588] bg-[#bda588]/10'
                  : 'border-[#333] text-[#888] hover:border-[#bda588] hover:text-[#bda588]'
              }`}
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Car grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.length > 0 ? (
            shown.map((car, i) => {
              const imgUrl = car.images?.[0] ?? '';
              return (
                <Link key={car.id} to={`/car/${car.id}`} className="no-underline">
                  <div
                    className="reveal bg-black border border-[#1a1a1a] overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,.5)] hover:border-[#bda588]"
                    style={{ transitionDelay: `${i * 0.08}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-[220px] overflow-hidden bg-[#111]">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={car.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.08]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-5 text-center">
                          <span
                            className="text-[18px] text-[#888]"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                          >
                            {car.name}
                          </span>
                        </div>
                      )}

                      {/* Featured badge — driven by is_featured from your DB */}
                      {car.isFeatured && (
                        <div
                          className="absolute top-4 left-4 bg-[#bda588] text-black text-[9px] uppercase tracking-[0.15em] font-bold px-3 py-1"
                          style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                          Featured
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                    </div>

                    {/* Info */}
                    <div className="px-6 pt-5 pb-6">
                      <p
                        className="uppercase tracking-[0.25em] text-[9px] text-[#bda588] mb-2"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                      >
                        {car.category} · {car.year}
                      </p>
                      <h3
                        className="text-[20px] text-[#f3f4f6] mb-4 leading-snug"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                      >
                        {car.name}
                      </h3>
                      <div className="flex justify-between items-center border-t border-[#1a1a1a] pt-4">
                        <div>
                          <p
                            className="uppercase tracking-[0.15em] text-[9px] text-[#888] mb-1"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                          >
                            Starting from
                          </p>
                          <p
                            className="text-[20px] text-[#f3f4f6]"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                          >
                            {car.priceDisplay || `₹${car.price}`}
                          </p>
                        </div>
                        <span
                          className="uppercase tracking-[0.15em] text-[10px] text-[#bda588]"
                          style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-24 text-[#888]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              No vehicles currently available in this category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
