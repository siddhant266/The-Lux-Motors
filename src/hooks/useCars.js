// src/hooks/useCars.js
import { useState, useEffect } from 'react';
import { fetchAllCars, fetchFeaturedCars } from '../api/cars';

/**
 * useCars — fetches all cars and featured cars in parallel.
 * Returns { allCars, featuredCars, loading, error }
 */
export function useCars() {
  const [allCars, setAllCars]           = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [all, featured] = await Promise.all([
          fetchAllCars(),
          fetchFeaturedCars(),
        ]);
        if (!cancelled) {
          setAllCars(all);
          // Fall back to first 6 of all cars if no featured exist in DB
          setFeaturedCars(featured.length ? featured : all.slice(0, 6));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { allCars, featuredCars, loading, error };
}
