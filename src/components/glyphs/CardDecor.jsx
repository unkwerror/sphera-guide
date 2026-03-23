/* ═══════════════════════════════════════════════════════════════
   CARD MICRO-DECORATIONS — production set
   ─────────────────────────────────────────────────────────────
   CardTopAccent      — thin accent/gold line at card top
   CardIndexNum       — ghost-colored card index
   CardGlyphWatermark — barely visible sigil in card background
   SectionGhostNum    — large faint section number
   ═══════════════════════════════════════════════════════════════ */

import { SIGIL_MAP } from './Sigils';

export function CardTopAccent({ color = 'var(--color-accent)', width = 40 }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      height: 1,
      background: color,
      boxShadow: color === 'var(--color-accent-gold)' ? 'var(--glow-gold)' : 'var(--glow-accent)',
    }} />
  );
}

export function CardIndexNum({ num = '01' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      fontWeight: 600,
      color: 'var(--color-text-tertiary)',
      letterSpacing: '0.1em',
      userSelect: 'none',
    }}>{num}</span>
  );
}

export function CardGlyphWatermark({ glyph = 'circuit', size = 80 }) {
  const GlyphComponent = SIGIL_MAP[glyph] || SIGIL_MAP.circuit;
  return (
    <div style={{
      position: 'absolute',
      right: -10,
      bottom: -10,
      opacity: 0.06,
      pointerEvents: 'none',
    }}>
      <GlyphComponent size={size} color="var(--color-text)" />
    </div>
  );
}

export function SectionGhostNum({ num = '01' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: 'var(--color-border)',
      lineHeight: 1,
      userSelect: 'none',
    }}>{num}</span>
  );
}
