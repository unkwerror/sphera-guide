/* ═══════════════════════════════════════════════════════════════
   CORNER DECORATIONS — production set
   ─────────────────────────────────────────────────────────────
   CornerMark  — individual corner SVG (tl, tr, bl, br)
   PanelCorners — wrapper that places all 4 on a relatively-
                  positioned container
   ═══════════════════════════════════════════════════════════════ */

export function CornerMark({ position = 'tl', size = 16, color = 'var(--color-border)', style = {} }) {
  const paths = {
    tl: 'M0,12 L0,0 L12,0',
    tr: 'M12,0 L24,0 L24,12',
    bl: 'M0,12 L0,24 L12,24',
    br: 'M12,24 L24,24 L24,12',
  };
  const dots = {
    tl: [0, 0],
    tr: [24, 0],
    bl: [0, 24],
    br: [24, 24],
  };
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      style={style} aria-hidden="true"
    >
      <path d={paths[position]} fill="none" stroke={color} strokeWidth="1" />
      <line
        x1={dots[position][0]}
        y1={dots[position][1] === 0 ? 6 : 18}
        x2={dots[position][0] === 0 ? 6 : 18}
        y2={dots[position][1]}
        stroke={color} strokeWidth="0.4"
      />
    </svg>
  );
}

export function PanelCorners({ size = 16, color = 'var(--color-border)', children, style = {} }) {
  const pos = (p) => ({
    position: 'absolute',
    ...(p.includes('t') ? { top: -1 } : { bottom: -1 }),
    ...(p.includes('l') ? { left: -1 } : { right: -1 }),
  });
  return (
    <div style={{ position: 'relative', ...style }}>
      <CornerMark position="tl" size={size} color={color} style={pos('tl')} />
      <CornerMark position="tr" size={size} color={color} style={pos('tr')} />
      <CornerMark position="bl" size={size} color={color} style={pos('bl')} />
      <CornerMark position="br" size={size} color={color} style={pos('br')} />
      {children}
    </div>
  );
}
