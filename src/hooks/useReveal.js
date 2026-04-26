// src/hooks/useReveal.js
import { useEffect } from 'react';

/**
 * useReveal — attaches an IntersectionObserver that adds `.visible`
 * to every `.reveal` element as it enters the viewport.
 */
export function useReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const frame = window.requestAnimationFrame(() => {
      els.forEach((el) => obs.observe(el));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      obs.disconnect();
    };
  }, [enabled]);
}
