/* ═══════════════════════════════════════════════════════════════
   SIGIL BULLETS — production set
   ─────────────────────────────────────────────────────────────
   SigilBullet — 6 micro SVG bullet shapes
   SigilList   — drop-in <ul> replacement with sigil bullets
   ═══════════════════════════════════════════════════════════════ */

export function SigilBullet({ type = 'diamond', size = 10, color = 'var(--color-accent)' }) {
  const s = { flexShrink: 0 };

  if (type === 'diamond') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill={color} />
      </svg>
    );
  }
  if (type === 'square') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
        <rect x="1" y="1" width="8" height="8" fill="none" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }
  if (type === 'cross') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
        <line x1="2" y1="5" x2="8" y2="5" stroke={color} strokeWidth="1.2" />
        <line x1="5" y1="2" x2="5" y2="8" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }
  if (type === 'circuit') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
        <circle cx="5" cy="5" r="3" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="5" cy="5" r="1.2" fill={color} />
      </svg>
    );
  }
  if (type === 'arrow') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
        <path d="M2 5 L8 5 M6 3 L8 5 L6 7" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={s}>
      <circle cx="5" cy="5" r="2.5" fill={color} />
    </svg>
  );
}

export function SigilList({ items = [], bulletType = 'diamond', bulletColor = 'var(--color-accent)' }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ marginTop: 5 }}>
            <SigilBullet type={bulletType} size={8} color={bulletColor} />
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
