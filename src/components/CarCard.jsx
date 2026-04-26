import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';

const CarCard = ({ car, index = 0 }) => {
  return (
    <Link to={`/car/${car.id}`} className="block no-underline">
      <article
        className="group card-pop overflow-hidden border border-[#1a1a1a] bg-black transition-all duration-500 hover:-translate-y-2 hover:border-[#bda588] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="relative h-64 overflow-hidden bg-[#111]">
          {car.images && car.images.length > 0 ? (
            <img
              src={car.images[0]}
              alt={car.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <span className="text-xl text-[#888]" style={{ fontFamily: '"Playfair Display", serif' }}>
                {car.name}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        </div>

        <div className="px-6 pb-6 pt-5">
          <p
            className="mb-2 text-[9px] uppercase tracking-[0.25em] text-[#bda588]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            {[car.category, car.year].filter(Boolean).join(' / ')}
          </p>

          <h3
            className="mb-4 text-[20px] leading-snug text-[#f3f4f6] transition-colors duration-300 group-hover:text-[#bda588]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {car.name}
          </h3>

          <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-4">
            <div>
              <p
                className="mb-1 text-[9px] uppercase tracking-[0.15em] text-[#888]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                Starting from
              </p>
              <p className="text-[20px] text-[#f3f4f6]" style={{ fontFamily: '"Playfair Display", serif' }}>
                {car.priceDisplay || formatPrice(car.price)}
              </p>
            </div>

            <span
              className="text-[10px] uppercase tracking-[0.15em] text-[#bda588]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Explore
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CarCard;
