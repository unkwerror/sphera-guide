import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════
   VISUAL DIRECTION EXPLORATION: BRUTALIST GRID
   ─────────────────────────────────────────────────────────────
   brutalism + neo-sigilism + subtle soft Y2K
   warm dark tones · structural · grid-heavy · raw
   ═══════════════════════════════════════════════════════════════ */

// ── palette ──
const C = {
  bg:        '#0e0e0e',
  raised:    '#151515',
  surface:   '#1a1a1a',
  sunken:    '#090909',
  border:    '#2a2a2a',
  borderStr: '#3a3a3a',
  text:      '#e8e4df',
  textSec:   '#9a9590',
  textTer:   '#5e5a55',
  accent:    '#b8a48c',
  accentDim: '#8a7968',
  accentFade:'rgba(184,164,140,0.08)',
  glyph:     '#2a2a2a',
  glyphHov:  '#3a3a3a',
  success:   '#6b8f71',
  warning:   '#b89a6b',
  error:     '#a86b6b',
};

const MONO = "'JetBrains Mono', monospace";
const BODY = "'Space Grotesk', sans-serif";

// ── SVG sigil components ──

function SigilCircuit({ size = 80, color = C.glyph, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="24" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="2" fill={color} />
      <line x1="50" y1="26" x2="50" y2="6" stroke={color} strokeWidth="0.5" />
      <line x1="50" y1="74" x2="50" y2="94" stroke={color} strokeWidth="0.5" />
      <line x1="26" y1="50" x2="6" y2="50" stroke={color} strokeWidth="0.5" />
      <line x1="74" y1="50" x2="94" y2="50" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="6" r="2" fill={color} />
      <circle cx="50" cy="94" r="2" fill={color} />
      <circle cx="6" cy="50" r="2" fill={color} />
      <circle cx="94" cy="50" r="2" fill={color} />
      <line x1="32" y1="32" x2="18" y2="18" stroke={color} strokeWidth="0.3" />
      <line x1="68" y1="32" x2="82" y2="18" stroke={color} strokeWidth="0.3" />
      <line x1="32" y1="68" x2="18" y2="82" stroke={color} strokeWidth="0.3" />
      <line x1="68" y1="68" x2="82" y2="82" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

function SigilDiamond({ size = 40, color = C.glyph, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <path d="M 20 50 L 50 20 L 80 50 L 50 80 Z" fill="none" stroke={color} strokeWidth="0.5" />
      <path d="M 35 50 L 50 35 L 65 50 L 50 65 Z" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="2" fill={color} />
      <line x1="50" y1="20" x2="50" y2="0" stroke={color} strokeWidth="0.3" />
      <line x1="50" y1="80" x2="50" y2="100" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

function SigilDivider({ color = C.glyph }) {
  return (
    <svg width="100%" height="3" viewBox="0 0 400 3" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="1.5" x2="120" y2="1.5" stroke={color} strokeWidth="1" />
      <circle cx="130" cy="1.5" r="1.5" fill={color} />
      <line x1="140" y1="1.5" x2="170" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="180" cy="1.5" r="1" fill={color} />
      <line x1="190" y1="1.5" x2="210" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="220" cy="1.5" r="1" fill={color} />
      <line x1="230" y1="1.5" x2="260" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="270" cy="1.5" r="1.5" fill={color} />
      <line x1="280" y1="1.5" x2="400" y2="1.5" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function SigilCorner({ size = 24, color = C.glyph, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <line x1="0" y1="0" x2="24" y2="0" stroke={color} strokeWidth="1" />
      <line x1="0" y1="0" x2="0" y2="24" stroke={color} strokeWidth="1" />
      <line x1="0" y1="8" x2="8" y2="0" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

// ── data ──

const NAV_TABS = ['ЗАДАЧИ', 'БЭКЛОГ', 'КАНБАН', 'СТРУКТУРА', 'ФИЛЬТРЫ', 'ВРЕМЯ'];

const TASKS = [
  { id: 'ROB-001', title: 'Интеграция PX4 с ROS2 для управления приводами', status: 'В РАБОТЕ', priority: 'ВЫСОКИЙ', type: 'Задача', sprint: 'Спринт 3' },
  { id: 'ROB-002', title: 'Калибровка LiDAR и fusion с IMU данными', status: 'РЕВЬЮ', priority: 'ВЫСОКИЙ', type: 'Подзадача', sprint: 'Спринт 3' },
  { id: 'CV-014', title: 'Подготовка тестового датасета для детектора огня', status: 'СОЗДАНО', priority: 'СРЕДНИЙ', type: 'Задача', sprint: 'Спринт 4' },
  { id: 'AI-007', title: 'Деплой LLM-пайплайна на inference server', status: 'В РАБОТЕ', priority: 'ВЫСОКИЙ', type: 'Задача', sprint: 'Спринт 3' },
  { id: 'CV-015', title: 'Оптимизация YOLO для NPU Orange Pi', status: 'ПЛАНИРОВАНИЕ', priority: 'СРЕДНИЙ', type: 'Эпик', sprint: '—' },
  { id: 'ROB-003', title: 'Документация по навигационному стеку', status: 'БЭКЛОГ', priority: 'НИЗКИЙ', type: 'Задача', sprint: '—' },
];

const PRIORITIES = { 'ВЫСОКИЙ': C.accent, 'СРЕДНИЙ': C.accentDim, 'НИЗКИЙ': C.textTer };
const STATUSES = { 'В РАБОТЕ': C.warning, 'РЕВЬЮ': C.accent, 'СОЗДАНО': C.textSec, 'ПЛАНИРОВАНИЕ': C.textTer, 'БЭКЛОГ': C.textTer };

// ── components ──

function TaskCard({ task }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.raised : C.surface,
        border: `1px solid ${hovered ? C.borderStr : C.border}`,
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* corner glyphs */}
      <SigilCorner size={16} color={hovered ? C.borderStr : C.glyph} style={{ position: 'absolute', top: 0, left: 0 }} />
      <SigilCorner size={16} color={hovered ? C.borderStr : C.glyph} style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)' }} />

      {/* header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
        <span style={{ fontFamily: MONO, fontSize: '10px', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {task.id}
        </span>
        <span style={{
          fontFamily: MONO, fontSize: '9px', color: PRIORITIES[task.priority] || C.textTer,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          border: `1px solid ${PRIORITIES[task.priority] || C.border}`,
          padding: '2px 6px',
        }}>
          {task.priority}
        </span>
      </div>

      {/* title */}
      <h3 style={{ fontFamily: BODY, fontSize: '14px', color: C.text, lineHeight: 1.5, marginBottom: '14px', fontWeight: 400 }}>
        {task.title}
      </h3>

      {/* meta row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
          color: STATUSES[task.status] || C.textTer,
        }}>
          ● {task.status}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textTer, letterSpacing: '0.06em' }}>
          {task.type}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '9px', color: C.textTer, letterSpacing: '0.06em' }}>
          {task.sprint}
        </span>
      </div>

      {/* background sigil */}
      <SigilCircuit
        size={48}
        color={C.glyph}
        style={{ position: 'absolute', bottom: '6px', right: '6px', opacity: hovered ? 0.3 : 0.12, transition: 'opacity 0.2s ease' }}
      />
    </div>
  );
}

function SectionHeader({ children, index }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '12px', marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '16px' }}>
      <span style={{ fontFamily: MONO, fontSize: '11px', color: C.textTer, letterSpacing: '0.1em' }}>
        {String(index).padStart(2, '0')}
      </span>
      <h2 style={{ fontFamily: MONO, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.text, fontWeight: 700 }}>
        {children}
      </h2>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ padding: '32px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SigilDivider color={C.glyph} />
    </div>
  );
}

// ── main exploration component ──

export default function DirectionBrutalistGrid() {
  const [activeTab, setActiveTab] = useState('ЗАДАЧИ');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        .xpl-brutalist *,
        .xpl-brutalist *::before,
        .xpl-brutalist *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        .xpl-brutalist {
          min-height: 100vh;
          background: ${C.bg};
          color: ${C.text};
          font-family: ${BODY};
          position: relative;
          overflow-x: hidden;
        }

        /* ── grid background ── */
        .xpl-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(${C.border} 1px, transparent 1px),
            linear-gradient(90deg, ${C.border} 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.18;
        }

        /* ── subtle Y2K scanline ── */
        .xpl-scanline {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(184,164,140,0.008) 2px,
            rgba(184,164,140,0.008) 4px
          );
        }

        .xpl-content { position: relative; z-index: 1; }

        /* ── nav ── */
        .xpl-nav {
          border-bottom: 1px solid ${C.border};
          background: ${C.bg};
          position: sticky; top: 0; z-index: 100;
          display: flex; overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .xpl-nav::-webkit-scrollbar { display: none; }

        .xpl-nav-tab {
          font-family: ${MONO};
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 18px 28px;
          background: none;
          border: none;
          border-right: 1px solid ${C.border};
          color: ${C.textTer};
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: color 0.15s ease, background-color 0.15s ease;
        }
        .xpl-nav-tab:hover {
          color: ${C.accentDim};
          background: ${C.raised};
        }
        .xpl-nav-tab[data-active="true"] {
          color: ${C.text};
          background: ${C.surface};
        }
        .xpl-nav-tab[data-active="true"]::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: ${C.accent};
        }

        .xpl-nav-space {
          font-family: ${MONO};
          font-size: 11px;
          letter-spacing: 0.1em;
          color: ${C.accent};
          padding: 18px 24px;
          border-right: 1px solid ${C.border};
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .xpl-nav-space-badge {
          background: ${C.accent};
          color: ${C.bg};
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          letter-spacing: 0.05em;
        }

        .xpl-nav-cta {
          font-family: ${MONO};
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0 28px;
          margin-left: auto;
          background: ${C.accent};
          color: ${C.bg};
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
          white-space: nowrap;
          font-weight: 700;
        }
        .xpl-nav-cta:hover { background: ${C.accentDim}; }

        /* ── hero ── */
        .xpl-hero {
          padding: 72px 40px 64px;
          border-bottom: 1px solid ${C.border};
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: start;
        }

        .xpl-hero-title {
          font-family: ${MONO};
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: ${C.text};
          line-height: 1.15;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(16px);
          animation: xplFadeUp 0.6s ease forwards;
        }

        .xpl-hero-sub {
          font-family: ${BODY};
          font-size: 16px;
          color: ${C.textSec};
          max-width: 640px;
          line-height: 1.7;
          opacity: 0;
          transform: translateY(12px);
          animation: xplFadeUp 0.6s ease 0.15s forwards;
        }

        .xpl-hero-sigil {
          opacity: 0;
          animation: xplFadeIn 1s ease 0.4s forwards;
        }

        .xpl-hero-meta {
          font-family: ${MONO};
          font-size: 10px;
          color: ${C.textTer};
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 28px;
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          opacity: 0;
          animation: xplFadeUp 0.6s ease 0.3s forwards;
        }

        .xpl-hero-meta span::before {
          content: '//  ';
          color: ${C.glyph};
        }

        /* ── manifesto ── */
        .xpl-manifesto {
          padding: 56px 40px;
          border-bottom: 1px solid ${C.border};
          max-width: 900px;
        }

        .xpl-manifesto-line {
          font-family: ${BODY};
          font-size: 15px;
          line-height: 1.8;
          color: ${C.text};
          margin-bottom: 20px;
          padding-left: 20px;
          border-left: 2px solid ${C.glyph};
        }
        .xpl-manifesto-line strong {
          font-family: ${MONO};
          font-size: 10px;
          color: ${C.accent};
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 4px;
        }

        /* ── task grid ── */
        .xpl-tasks {
          padding: 48px 40px;
        }

        .xpl-task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px;
          background: ${C.border};
          border: 1px solid ${C.border};
        }
        .xpl-task-grid > div {
          background: ${C.bg};
        }

        /* ── kanban preview ── */
        .xpl-kanban {
          padding: 48px 40px;
          border-bottom: 1px solid ${C.border};
        }

        .xpl-kanban-cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid ${C.border};
        }

        .xpl-kanban-col {
          border-right: 1px solid ${C.border};
          min-height: 200px;
        }
        .xpl-kanban-col:last-child { border-right: none; }

        .xpl-kanban-col-head {
          font-family: ${MONO};
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 14px 16px;
          border-bottom: 1px solid ${C.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .xpl-kanban-col-count {
          font-family: ${MONO};
          font-size: 9px;
          color: ${C.textTer};
          background: ${C.raised};
          padding: 2px 6px;
          border: 1px solid ${C.border};
        }

        .xpl-kanban-card {
          padding: 12px 16px;
          border-bottom: 1px solid ${C.border};
          transition: background-color 0.12s ease;
        }
        .xpl-kanban-card:hover { background: ${C.raised}; }

        .xpl-kanban-card-id {
          font-family: ${MONO};
          font-size: 9px;
          color: ${C.accent};
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .xpl-kanban-card-title {
          font-family: ${BODY};
          font-size: 13px;
          color: ${C.text};
          line-height: 1.4;
        }

        /* ── CTA block ── */
        .xpl-cta-block {
          padding: 48px 40px;
          border-bottom: 1px solid ${C.border};
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .xpl-cta-btn {
          font-family: ${MONO};
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          padding: 14px 32px;
          cursor: pointer;
          border: none;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .xpl-cta-primary {
          background: ${C.accent};
          color: ${C.bg};
        }
        .xpl-cta-primary:hover {
          background: ${C.text};
        }
        .xpl-cta-secondary {
          background: none;
          border: 1px solid ${C.border};
          color: ${C.textSec};
        }
        .xpl-cta-secondary:hover {
          border-color: ${C.borderStr};
          color: ${C.text};
          background: ${C.raised};
        }

        /* ── footer ── */
        .xpl-footer {
          padding: 40px;
          text-align: center;
          border-top: 1px solid ${C.border};
        }
        .xpl-footer-text {
          font-family: ${MONO};
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: ${C.textTer};
        }

        /* ── ASCII micro-detail ── */
        .xpl-ascii {
          font-family: ${MONO};
          font-size: 9px;
          color: ${C.textTer};
          letter-spacing: 0.1em;
          line-height: 1.3;
          white-space: pre;
          user-select: none;
        }

        /* ── animations ── */
        @keyframes xplFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes xplFadeIn {
          to { opacity: 1; }
        }
        @keyframes xplPulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.25; }
        }
        .xpl-pulse {
          animation: xplPulse 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .xpl-brutalist *,
          .xpl-brutalist *::before,
          .xpl-brutalist *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .xpl-pulse { animation: none !important; opacity: 0.12; }
        }

        @media (max-width: 768px) {
          .xpl-hero {
            grid-template-columns: 1fr;
            padding: 48px 20px 40px;
          }
          .xpl-hero-sigil { display: none; }
          .xpl-manifesto,
          .xpl-tasks,
          .xpl-kanban,
          .xpl-cta-block { padding-left: 20px; padding-right: 20px; }
          .xpl-task-grid { grid-template-columns: 1fr; }
          .xpl-kanban-cols { grid-template-columns: 1fr; }
          .xpl-kanban-col { border-right: none; border-bottom: 1px solid ${C.border}; }
          .xpl-kanban-col:last-child { border-bottom: none; }
          .xpl-nav-tab { padding: 14px 16px; font-size: 10px; letter-spacing: 0.08em; }
        }
      `}</style>

      <div className="xpl-brutalist">
        {/* structural grid background */}
        <div className="xpl-grid-bg" />
        {/* Y2K scanline overlay */}
        <div className="xpl-scanline" />

        <div className="xpl-content">

          {/* ══ NAVIGATION ══ */}
          <nav className="xpl-nav" role="navigation" aria-label="Сфера навигация">
            <div className="xpl-nav-space">
              <span className="xpl-nav-space-badge">IIR51</span>
              ROBOCAR
            </div>
            {NAV_TABS.map((tab) => (
              <button
                key={tab}
                className="xpl-nav-tab"
                data-active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {tab}
              </button>
            ))}
            <button className="xpl-nav-cta">
              Создать задачу
            </button>
          </nav>

          {/* ══ HERO ══ */}
          <section className="xpl-hero">
            <div>
              <h1 className="xpl-hero-title">
                Проектная<br />
                дисциплина<br />
                <span style={{ color: C.accent }}>начинается</span><br />
                здесь
              </h1>
              <p className="xpl-hero-sub">
                Сфера.Задачи — не отчётность ради отчётности.
                Это инструмент, который делает хаос видимым, ответственность — явной,
                а прогресс — измеримым. Ты инженер. Работай как инженер.
              </p>
              <div className="xpl-hero-meta">
                <span>ИИР НГУ</span>
                <span>Мехатроника и робототехника</span>
                <span>2–3 курс</span>
              </div>
            </div>
            <div className="xpl-hero-sigil" style={{ paddingTop: '16px' }}>
              <SigilCircuit size={120} color={C.glyph} />
              <div className="xpl-ascii" style={{ marginTop: '16px', textAlign: 'center' }}>
                {`  ┌──────┐\n  │ INIT │\n  └──┬───┘\n     │\n     ▼`}
              </div>
            </div>
          </section>

          {/* ══ DIVIDER ══ */}
          <Divider />

          {/* ══ MANIFESTO ══ */}
          <section className="xpl-manifesto">
            <SectionHeader index={1}>Почему это важно</SectionHeader>
            <div className="xpl-manifesto-line">
              <strong>Проблема</strong>
              Команда из трёх человек. Один пишет код, второй «ищет информацию», третий молчит.
              Через месяц — один выгорел, двое не знают, что происходит. Проект горит.
            </div>
            <div className="xpl-manifesto-line">
              <strong>Решение</strong>
              Бэклог → Спринт → Задача → Исполнитель → Статус → Ревью.
              Каждый знает, что делает. Каждый видит, кто что сделал.
              Прозрачность — это не контроль. Это уважение к команде.
            </div>
            <div className="xpl-manifesto-line">
              <strong>Принцип</strong>
              SMART-задача лучше, чем «надо сделать бэкенд».
              Конкретный результат лучше, чем «работал над проектом».
              Два часа сфокусированной работы лучше, чем неделя прокрастинации.
            </div>
          </section>

          {/* ══ DIVIDER ══ */}
          <Divider />

          {/* ══ TASKS GRID ══ */}
          <section className="xpl-tasks">
            <SectionHeader index={2}>Активные задачи</SectionHeader>
            <div className="xpl-task-grid">
              {TASKS.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>

          {/* ══ DIVIDER ══ */}
          <Divider />

          {/* ══ KANBAN PREVIEW ══ */}
          <section className="xpl-kanban">
            <SectionHeader index={3}>Канбан</SectionHeader>
            <div className="xpl-kanban-cols">
              {/* ОТКРЫТА */}
              <div className="xpl-kanban-col">
                <div className="xpl-kanban-col-head" style={{ color: C.textSec }}>
                  <span>Открыта</span>
                  <span className="xpl-kanban-col-count">2</span>
                </div>
                <div className="xpl-kanban-card">
                  <div className="xpl-kanban-card-id">CV-014</div>
                  <div className="xpl-kanban-card-title">Подготовка тестового датасета для детектора огня</div>
                </div>
                <div className="xpl-kanban-card">
                  <div className="xpl-kanban-card-id">CV-015</div>
                  <div className="xpl-kanban-card-title">Оптимизация YOLO для NPU Orange Pi</div>
                </div>
              </div>

              {/* В РАБОТЕ */}
              <div className="xpl-kanban-col">
                <div className="xpl-kanban-col-head" style={{ color: C.warning }}>
                  <span>В работе</span>
                  <span className="xpl-kanban-col-count">2</span>
                </div>
                <div className="xpl-kanban-card">
                  <div className="xpl-kanban-card-id">ROB-001</div>
                  <div className="xpl-kanban-card-title">Интеграция PX4 с ROS2 для управления приводами</div>
                </div>
                <div className="xpl-kanban-card">
                  <div className="xpl-kanban-card-id">AI-007</div>
                  <div className="xpl-kanban-card-title">Деплой LLM-пайплайна на inference server</div>
                </div>
              </div>

              {/* РЕШЕНА */}
              <div className="xpl-kanban-col">
                <div className="xpl-kanban-col-head" style={{ color: C.success }}>
                  <span>Решена</span>
                  <span className="xpl-kanban-col-count">1</span>
                </div>
                <div className="xpl-kanban-card">
                  <div className="xpl-kanban-card-id">ROB-002</div>
                  <div className="xpl-kanban-card-title">Калибровка LiDAR и fusion с IMU данными</div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ CTA BLOCK ══ */}
          <div className="xpl-cta-block">
            <SigilDiamond size={32} color={C.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: MONO, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.text, marginBottom: '4px' }}>
                Готов начать?
              </div>
              <div style={{ fontFamily: BODY, fontSize: '14px', color: C.textSec }}>
                Первый шаг — создать задачу. Второй — сделать её.
              </div>
            </div>
            <button className="xpl-cta-btn xpl-cta-primary">Создать задачу</button>
            <button className="xpl-cta-btn xpl-cta-secondary">Как начать</button>
          </div>

          {/* ══ FOOTER ══ */}
          <footer className="xpl-footer">
            <div className="xpl-pulse" style={{ marginBottom: '16px', display: 'inline-block' }}>
              <SigilCircuit size={48} color={C.glyph} />
            </div>
            <div className="xpl-footer-text">
              Сфера.Задачи · ИИР НГУ · Мехатроника и робототехника
            </div>
            <div className="xpl-ascii" style={{ marginTop: '12px', display: 'inline-block' }}>
              {`  /\\_/\\  \n ( o.o ) \n  > ^ <  `}
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
