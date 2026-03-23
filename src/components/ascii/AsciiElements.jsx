/* ═══════════════════════════════════════════════════════════════
   ASCII MICRO-DETAILS — production set
   ─────────────────────────────────────────────────────────────
   Tiny monospaced decorative elements. Clean, tasteful,
   terminal-nostalgia. No meme energy.
   ═══════════════════════════════════════════════════════════════ */

const pre = (color) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: '0.55rem',
  lineHeight: 1.2,
  color,
  userSelect: 'none',
  margin: 0,
  border: 'none',
  background: 'none',
  padding: 0,
});

export function AsciiCat({ color = 'var(--color-text-tertiary)' }) {
  return (
    <pre style={pre(color)}>{`  /\\_/\\
 ( o.o )
  > ^ <`}</pre>
  );
}

export function AsciiArrow({ direction = 'right', color = 'var(--color-text-tertiary)' }) {
  const arrows = {
    right: '──▶',
    left: '◀──',
    down: '│\n▼',
    up: '▲\n│',
  };
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      color,
      whiteSpace: 'pre',
      userSelect: 'none',
    }}>{arrows[direction]}</span>
  );
}

export function AsciiBox({ text = 'SYS', color = 'var(--color-text-tertiary)' }) {
  const t = '┌' + '─'.repeat(text.length + 2) + '┐';
  const m = '│ ' + text + ' │';
  const b = '└' + '─'.repeat(text.length + 2) + '┘';
  return <pre style={pre(color)}>{`${t}\n${m}\n${b}`}</pre>;
}

export function AsciiSeparator({ char = '·', count = 20, color = 'var(--color-text-tertiary)' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      color,
      letterSpacing: '0.25em',
      userSelect: 'none',
    }}>{char.repeat(count)}</span>
  );
}

export function AsciiBlock({ color = 'var(--color-text-tertiary)' }) {
  return <pre style={pre(color)}>{`╔══╗\n║▓▓║\n╚══╝`}</pre>;
}
