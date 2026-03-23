/* ═══════════════════════════════════════════════════════════════
   FRAMES & OVERLAYS — production set
   ─────────────────────────────────────────────────────────────
   TerminalFrame   — panel with title bar + status dot
   BracketFrame    — retro bracket boundary container
   ScanlineOverlay — fixed full-screen scanline texture (Y2K)
   ═══════════════════════════════════════════════════════════════ */

import { StatusDot } from './Markers';

export function TerminalFrame({ title, children, style = {} }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: 'var(--color-bg-raised)',
        }}>
          <StatusDot status="active" size={4} />
          <span>{title}</span>
        </div>
      )}
      <div style={{ padding: '1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

export function BracketFrame({ children, style = {} }) {
  const bracket = (top, left) => ({
    position: 'absolute',
    ...(top ? { top: 8 } : { bottom: 8 }),
    ...(left ? { left: 8 } : { right: 8 }),
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    color: 'var(--color-border)',
    userSelect: 'none',
  });
  return (
    <div style={{
      position: 'relative',
      padding: '1.5rem 2rem',
      ...style,
    }}>
      <span style={bracket(true, true)}>[</span>
      <span style={bracket(true, false)}>]</span>
      <span style={bracket(false, true)}>[</span>
      <span style={bracket(false, false)}>]</span>
      {children}
    </div>
  );
}

export function ScanlineOverlay({ opacity = 0.35 }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        background: `repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.025) 0px,
          transparent 1px,
          transparent 2px
        )`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
