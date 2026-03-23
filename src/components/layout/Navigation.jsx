import { useState, useEffect, useRef } from 'react';
import { SigilCircuit, BracketOrnament } from '../glyphs';

const SECTIONS = [
  { id: 'hero', num: '01', label: 'Старт' },
  { id: 'first-steps', num: '02', label: 'Первый день' },
  { id: 'task-writing', num: '03', label: 'Задачи' },
  { id: 'screens', num: '04', label: 'Экраны' },
  { id: 'sprint', num: '05', label: 'Спринт' },
  { id: 'examples', num: '06', label: 'Примеры' },
  { id: 'team', num: '07', label: 'Команда' },
  { id: 'contact', num: '08', label: 'Контакты' },
];

export default function Navigation() {
  const [active, setActive] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setScrollPct(Math.min(pct, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActive(top.target.id);
        }
      },
      { threshold: 0.15, rootMargin: '-80px 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="nav-progress" style={{ transform: `scaleX(${scrollPct})` }} />
      <nav ref={navRef} className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <SigilCircuit size={16} color="var(--color-accent)" />
            <span className="nav-logo-text">СФЕРА</span>
          </div>
          <div className="nav-tabs">
            {SECTIONS.map(s => (
              <button
                type="button"
                key={s.id}
                className={`nav-tab ${active === s.id ? 'nav-tab--active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {active === s.id && <BracketOrnament text=">>" color="var(--color-accent)" />}
                <span className="nav-tab-num">{s.num}</span>
                <span className="nav-tab-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const CSS = `
  .nav-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
    box-shadow: var(--glow-accent);
    transform-origin: left;
    z-index: 1001;
    pointer-events: none;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(10, 12, 16, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    height: 48px;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .nav-logo-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--color-text);
  }

  .nav-tabs {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .nav-tabs::-webkit-scrollbar { display: none; }

  .nav-tab {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    transition: color var(--transition-fast), border-color var(--transition-base);
  }

  .nav-tab:hover {
    color: var(--color-text-secondary);
  }

  .nav-tab--active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
  }

  .nav-tab-num {
    color: var(--color-text-tertiary);
    margin-right: 2px;
  }

  .nav-tab--active .nav-tab-num {
    color: var(--color-accent);
  }

  @media (max-width: 768px) {
    .nav-inner {
      padding: 0 0.75rem;
      gap: 0.65rem;
      height: 56px;
    }

    .nav-tabs {
      width: 100%;
      gap: 0.15rem;
      scroll-snap-type: x proximity;
      padding-bottom: 2px;
    }

    .nav-tab {
      padding: 0.65rem 0.72rem;
      font-size: 0.62rem;
      line-height: 1.1;
      letter-spacing: 0.05em;
      scroll-snap-align: start;
    }

    .nav-tab-label {
      display: inline;
    }

    .nav-tab-num {
      margin-right: 0;
      opacity: 0.9;
    }
  }
`;
