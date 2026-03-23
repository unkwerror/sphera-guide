import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to the ref element.
 * Adds `.motion-visible` when the element enters the viewport.
 *
 * Options:
 *   threshold — visibility fraction to trigger (default 0.15)
 *   rootMargin — margin around root (default '0px 0px -40px 0px')
 *   once — if true, unobserves after first trigger (default true)
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref} className="motion-reveal">…</section>
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('motion-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('motion-visible');
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Batch version: observes multiple elements inside a container.
 * Each child with [data-reveal] gets .motion-visible independently.
 *
 * Usage:
 *   const containerRef = useScrollRevealAll();
 *   <div ref={containerRef}>
 *     <div data-reveal className="motion-reveal">…</div>
 *     <div data-reveal className="motion-panel">…</div>
 *   </div>
 */
export function useScrollRevealAll({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  selector = '[data-reveal]',
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      elements.forEach(el => el.classList.add('motion-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, selector]);

  return ref;
}
