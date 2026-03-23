/* ═══════════════════════════════════════════════════════════════
   TERMINAL MARKERS — production set
   ─────────────────────────────────────────────────────────────
   CursorBlink     — animated block cursor (requires glyphs.css)
   BracketOrnament — [>>] / [::] mono ornament
   StatusDot       — 6px square status indicator
   PromptMarker    — terminal prompt prefix
   TerminalLine    — prefix + text single-line
   ═══════════════════════════════════════════════════════════════ */

export function CursorBlink({ color = 'var(--color-accent)' }) {
  return (
    <span
      className="glyph-cursor-blink"
      style={{
        display: 'inline-block',
        width: '0.55em',
        height: '1.1em',
        background: color,
        verticalAlign: 'text-bottom',
      }}
    />
  );
}

export function BracketOrnament({ text = '>>', color = 'var(--color-accent)' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      color,
      letterSpacing: '0.05em',
      userSelect: 'none',
    }}>[{text}]</span>
  );
}

export function StatusDot({ status = 'active', size = 6 }) {
  const colors = {
    active: 'var(--color-accent)',
    done: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    idle: 'var(--color-text-tertiary)',
    gold: 'var(--color-accent-gold)',
  };
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      background: colors[status] || colors.active,
    }} />
  );
}

export function PromptMarker({ prefix = '>', color = 'var(--color-text-secondary)' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
      fontWeight: 600,
      color,
      userSelect: 'none',
      marginRight: 6,
    }}>{prefix}</span>
  );
}

export function TerminalLine({ prefix = '$', text = '', color = 'var(--color-text-secondary)' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
    }}>
      <span style={{ color: 'var(--color-accent)', userSelect: 'none' }}>{prefix}</span>
      <span style={{ color }}>{text}</span>
    </div>
  );
}
