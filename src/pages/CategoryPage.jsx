import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import CarCard from '../components/CarCard';
import { fetchAllCars } from '../api/cars';
import { useReveal } from '../hooks/useReveal';

const categories = ['All', 'Vintage', 'Sports', 'Sedan', 'Adventure', 'Ultra Luxury'];

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useReveal(!loading);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchAllCars();
        setCars(data);
      } catch (err) {
        console.error('Failed to load cars', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    if (category === 'All') {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ category }, { replace: true });
  };

  const filteredCars =
    activeCategory === 'All'
      ? cars
      : cars.filter((car) => car.category && car.category.toLowerCase() === activeCategory.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#bda588] flex items-center justify-center font-sans tracking-[.2em]">
        LOADING COLLECTION...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="mx-auto max-w-[1920px] border-b border-[#1a1a1a] px-6 pt-32 pb-16 text-center md:px-12 lg:px-24">
        <h1
          className="mb-6 text-4xl font-bold text-[#f3f4f6] md:text-5xl"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Our Collection
        </h1>
        <p
          className="mx-auto max-w-2xl text-sm leading-relaxed text-[#a0a0a0]"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          Discover our meticulously curated selection of the world&apos;s most prestigious automobiles.
          From timeless vintage classics to modern hypercars.
        </p>
      </div>

      <div className="mx-auto max-w-[1920px] px-6 py-8 md:px-12 lg:px-24">
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-wider transition-colors border ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'border-[#bda588] text-[#bda588] bg-[#bda588]/10'
                  : 'border-[#333] text-[#888] hover:border-[#bda588] hover:text-[#bda588]'
              }`}
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1920px] px-6 pb-24 md:px-12 lg:px-24">
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-[#888]">
            <p style={{ fontFamily: '"Montserrat", sans-serif' }}>
              No vehicles currently available in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
