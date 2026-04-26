import { Link } from 'react-router-dom';
import { Car, Crown, Gauge, Mountain, Sparkles } from 'lucide-react';
import { CATEGORIES_META, CATEGORY_ORDER } from './constants';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1591293836027-e05b48473b67?auto=format&fit=crop&q=80&w=600';

const CATEGORY_FALLBACK_IMAGES = {
  vintage:
    'https://www.netcarshow.com/Aston_Martin-DB5-1963-1280-412f878498001ee4c4e186cf901b04e42c.jpg?token=46750a65911eccabbc8742ac90ac5d06ab52828dcdb07586cc0be62',
  sports:
    'https://www.netcarshow.com/BMW-M4_Coupe_Competition-2021-1280-bfc2c349a87005beb51dda71346144f61e.jpg?token=f461c852911ec8abbc8742ac90a53bb77a7ae9388d61d5f894e9037',
  sedan:
    'https://www.netcarshow.com/Audi-A6-2019-1280-301aad105dcef46f83fdb2e052e5066faf.jpg?token=9735b738911eceabbc8742ac90a6992bc7e27089199973d6b4ccdeb',
  adventure:
    'https://www.netcarshow.com/Audi-Q7_TFSI_e_quattro-2024-1280-bf060c758ea7d68428d6a13271f4fb610f.jpg',
  'ultra luxury':
    'https://www.netcarshow.com/BMW-i7-2023-1280-67c69425a6b481de4c85976de1029e49cf.jpg',
};

const CATEGORY_ICONS = {
  vintage: Sparkles,
  sports: Gauge,
  sedan: Car,
  adventure: Mountain,
  'ultra luxury': Crown,
};

export default function CategoriesSection({ cars }) {
  const getCatImg = (catLabel) => {
    const categoryKey = catLabel.toLowerCase();

    if (categoryKey === 'sedan') {
      return CATEGORY_FALLBACK_IMAGES.sedan;
    }

    if (!cars || cars.length === 0) return CATEGORY_FALLBACK_IMAGES[categoryKey] || FALLBACK_IMG;

    const match = cars.find(
      (car) => car.category?.toLowerCase() === categoryKey && car.images?.length > 0
    );

    return match ? match.images[0] : CATEGORY_FALLBACK_IMAGES[categoryKey] || FALLBACK_IMG;
  };

  return (
    <section className="bg-black px-12 py-24 md:px-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#bda588]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Explore by Category
          </span>
          <h2
            className="mt-3 font-light leading-[1.1] text-[#f3f4f6]"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.5rem,4vw,3.5rem)' }}
          >
            Every Kind of Excellence
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_ORDER.map((catLabel) => {
            const meta = CATEGORIES_META[catLabel.toLowerCase()];
            if (!meta) return null;

            const categoryKey = catLabel.toLowerCase();
            const catImg = getCatImg(catLabel);
            const fallbackImg = CATEGORY_FALLBACK_IMAGES[categoryKey] || FALLBACK_IMG;
            const Icon = CATEGORY_ICONS[categoryKey] || Car;

            return (
              <Link
                key={catLabel}
                to={`/models?category=${encodeURIComponent(catLabel)}`}
                className="relative h-[360px] min-w-0 cursor-pointer overflow-hidden border border-[#1a1a1a] no-underline"
              >
                <img
                  src={catImg}
                  alt={`${catLabel} category`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  onError={(event) => {
                    if (event.currentTarget.src !== fallbackImg) {
                      event.currentTarget.src = fallbackImg;
                    } else {
                      event.currentTarget.src = FALLBACK_IMG;
                    }
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.3) 60%, rgba(0,0,0,.1) 100%)',
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[#bda588]/40 bg-black/35 text-[#bda588]">
                    <Icon size={18} />
                  </div>
                  <h3
                    className="mb-1.5 overflow-hidden text-ellipsis font-normal text-[#f3f4f6]"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '22px',
                      whiteSpace: 'normal',
                    }}
                  >
                    {catLabel}
                  </h3>
                  <p
                    className="text-[11px] tracking-[0.1em] text-[rgba(245,240,232,0.6)]"
                    style={{
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {meta.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
