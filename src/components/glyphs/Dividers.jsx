/* ═══════════════════════════════════════════════════════════════
   SECTION DIVIDERS — production set
   ─────────────────────────────────────────────────────────────
   5 divider patterns. Full-width, accept color overrides.
   ═══════════════════════════════════════════════════════════════ */

export function DividerNodeLine({ color = 'var(--color-border)', accent = 'var(--color-accent)' }) {
  return (
    <svg width="100%" height="3" viewBox="0 0 600 3" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="1.5" cy="1.5" r="1.5" fill={accent} />
      <line x1="6" y1="1.5" x2="180" y2="1.5" stroke={color} strokeWidth="1" />
      <circle cx="185" cy="1.5" r="1" fill={color} />
      <line x1="190" y1="1.5" x2="230" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="235" cy="1.5" r="0.8" fill={color} />
      <line x1="240" y1="1.5" x2="360" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="365" cy="1.5" r="0.8" fill={color} />
      <line x1="370" y1="1.5" x2="410" y2="1.5" stroke={color} strokeWidth="0.5" />
      <circle cx="415" cy="1.5" r="1" fill={color} />
      <line x1="420" y1="1.5" x2="594" y2="1.5" stroke={color} strokeWidth="1" />
      <circle cx="598.5" cy="1.5" r="1.5" fill={accent} />
    </svg>
  );
}

export function DividerCircuitTrace({ color = 'var(--color-border)', accent = 'var(--color-accent)' }) {
  return (
    <svg width="100%" height="7" viewBox="0 0 600 7" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="3.5" x2="140" y2="3.5" stroke={color} strokeWidth="1" />
      <rect x="140" y="1" width="5" height="5" fill="none" stroke={color} strokeWidth="0.8" />
      <line x1="147" y1="3.5" x2="200" y2="3.5" stroke={color} strokeWidth="0.5" />
      <line x1="200" y1="3.5" x2="210" y2="1" stroke={color} strokeWidth="0.5" />
      <line x1="210" y1="1" x2="280" y2="1" stroke={color} strokeWidth="0.5" />
      <circle cx="290" cy="1" r="1.5" fill={accent} />
      <line x1="300" y1="1" x2="370" y2="1" stroke={color} strokeWidth="0.5" />
      <line x1="370" y1="1" x2="380" y2="3.5" stroke={color} strokeWidth="0.5" />
      <line x1="380" y1="3.5" x2="450" y2="3.5" stroke={color} strokeWidth="0.5" />
      <rect x="450" y="1" width="5" height="5" fill="none" stroke={color} strokeWidth="0.8" />
      <line x1="457" y1="3.5" x2="600" y2="3.5" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function DividerGoldRitual() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 2,
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent, var(--color-accent-gold), transparent)',
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 6,
        height: 6,
        background: 'var(--color-accent-gold)',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        boxShadow: 'var(--glow-gold)',
      }} />
    </div>
  );
}

export function DividerDashedTerminal({ color = 'var(--color-border)' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      width: '100%',
    }}>
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} style={{
          flex: '1 1 0',
          height: 1,
          background: color,
          opacity: i % 2 === 0 ? 1 : 0,
        }} />
      ))}
    </div>
  );
}

export function DividerBracket({ color = 'var(--color-text-tertiary)' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      color,
      letterSpacing: '0.3em',
      userSelect: 'none',
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
      <span>{'[ · · · ]'}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
    </div>
  );
}
