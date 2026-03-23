/* ═══════════════════════════════════════════════════════════════
   BADGES & TAGS — production set
   ─────────────────────────────────────────────────────────────
   MonoBadge   — mono uppercase micro-label (4 variants)
   StatusBadge — status indicator with integrated StatusDot
   ═══════════════════════════════════════════════════════════════ */

import { StatusDot } from './Markers';

const MONO_BADGE_VARIANTS = {
  default: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
  accent: {
    background: 'var(--color-accent)',
    color: 'var(--color-bg)',
    border: '1px solid var(--color-accent)',
    textShadow: 'var(--glow-accent)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-tertiary)',
    border: '1px solid var(--color-border-subtle)',
  },
  gold: {
    background: 'var(--color-accent-gold-muted)',
    color: 'var(--color-accent-gold)',
    border: '1px solid rgba(196, 168, 130, 0.25)',
  },
};

export function MonoBadge({ children, variant = 'default' }) {
  const v = MONO_BADGE_VARIANTS[variant] || MONO_BADGE_VARIANTS.default;
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '0.3rem 0.7rem',
      ...v,
    }}>{children}</span>
  );
}

export function StatusBadge({ status = 'active', label }) {
  const config = {
    active: { color: 'var(--color-accent)', bg: 'var(--color-accent-muted)' },
    done: { color: 'var(--color-success)', bg: 'rgba(90, 154, 107, 0.12)' },
    warning: { color: 'var(--color-warning)', bg: 'rgba(184, 154, 107, 0.12)' },
    error: { color: 'var(--color-error)', bg: 'rgba(168, 107, 107, 0.12)' },
    idle: { color: 'var(--color-text-tertiary)', bg: 'rgba(74, 85, 104, 0.12)' },
  };
  const c = config[status] || config.active;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '0.3rem 0.7rem',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.color}`,
    }}>
      <StatusDot status={status} size={5} />
      {label || status}
    </span>
  );
}
