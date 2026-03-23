/* ═══════════════════════════════════════════════════════════════
   SVG SIGIL GLYPHS — production set
   ─────────────────────────────────────────────────────────────
   6 abstract techno-ritual glyphs. Thin linework (0.3–0.6),
   node-dot centers, radial extension lines. All accept:
     size    — number (px, square bounding box)
     color   — CSS color string or var()
     style   — inline style override
   ═══════════════════════════════════════════════════════════════ */

/**
 * FAMILY A — Node Glyphs (systems, connections)
 *   Circuit    — the primary system sigil
 *   HexNode    — network/module node
 *   Crosshair  — focus/target
 *
 * FAMILY B — Marker Glyphs (hierarchy, status)
 *   Diamond    — primary marker / bullet base
 *   Delta      — structural/hierarchy marker
 *
 * FAMILY C — Sensor Glyphs (observation, tracking)
 *   Scan       — radar/sweep pattern
 */

export function SigilCircuit({ size = 48, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="24" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="2.5" fill={color} />
      <line x1="50" y1="26" x2="50" y2="4" stroke={color} strokeWidth="0.5" />
      <line x1="50" y1="74" x2="50" y2="96" stroke={color} strokeWidth="0.5" />
      <line x1="26" y1="50" x2="4" y2="50" stroke={color} strokeWidth="0.5" />
      <line x1="74" y1="50" x2="96" y2="50" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="4" r="2" fill={color} />
      <circle cx="50" cy="96" r="2" fill={color} />
      <circle cx="4" cy="50" r="2" fill={color} />
      <circle cx="96" cy="50" r="2" fill={color} />
      <line x1="33" y1="33" x2="18" y2="18" stroke={color} strokeWidth="0.3" />
      <line x1="67" y1="33" x2="82" y2="18" stroke={color} strokeWidth="0.3" />
      <line x1="33" y1="67" x2="18" y2="82" stroke={color} strokeWidth="0.3" />
      <line x1="67" y1="67" x2="82" y2="82" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

export function SigilHexNode({ size = 32, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <polygon
        points="50,10 90,30 90,70 50,90 10,70 10,30"
        fill="none" stroke={color} strokeWidth="0.6"
      />
      <polygon
        points="50,30 70,40 70,60 50,70 30,60 30,40"
        fill="none" stroke={color} strokeWidth="0.4"
      />
      <circle cx="50" cy="50" r="3" fill={color} />
      <line x1="50" y1="10" x2="50" y2="0" stroke={color} strokeWidth="0.3" />
      <line x1="50" y1="90" x2="50" y2="100" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

export function SigilCrosshair({ size = 28, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={color} strokeWidth="0.6" />
      <line x1="50" y1="0" x2="50" y2="34" stroke={color} strokeWidth="0.5" />
      <line x1="50" y1="66" x2="50" y2="100" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1="50" x2="34" y2="50" stroke={color} strokeWidth="0.5" />
      <line x1="66" y1="50" x2="100" y2="50" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="2" fill={color} />
    </svg>
  );
}

export function SigilDiamond({ size = 32, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <path d="M 20 50 L 50 20 L 80 50 L 50 80 Z" fill="none" stroke={color} strokeWidth="0.6" />
      <path d="M 35 50 L 50 35 L 65 50 L 50 65 Z" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="2.5" fill={color} />
      <line x1="50" y1="20" x2="50" y2="2" stroke={color} strokeWidth="0.3" />
      <line x1="50" y1="80" x2="50" y2="98" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

export function SigilDelta({ size = 32, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" style={style} aria-hidden="true">
      <polygon points="50,5 95,85 5,85" fill="none" stroke={color} strokeWidth="0.6" />
      <polygon points="50,35 72,75 28,75" fill="none" stroke={color} strokeWidth="0.4" />
      <circle cx="50" cy="58" r="2" fill={color} />
      <line x1="50" y1="5" x2="50" y2="0" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

export function SigilScan({ size = 36, color = 'var(--color-glyph)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="0.5" />
      <path d="M 50 12 A 38 38 0 0 1 88 50" fill="none" stroke={color} strokeWidth="0.8" />
      <path d="M 50 88 A 38 38 0 0 1 12 50" fill="none" stroke={color} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.4" />
      <line x1="50" y1="50" x2="76" y2="26" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="3" fill={color} />
      <circle cx="76" cy="26" r="1.5" fill={color} />
      <line x1="50" y1="12" x2="50" y2="4" stroke={color} strokeWidth="0.3" />
      <line x1="50" y1="88" x2="50" y2="96" stroke={color} strokeWidth="0.3" />
    </svg>
  );
}

export const SIGIL_FAMILIES = {
  node: { Circuit: SigilCircuit, HexNode: SigilHexNode, Crosshair: SigilCrosshair },
  marker: { Diamond: SigilDiamond, Delta: SigilDelta },
  sensor: { Scan: SigilScan },
};

export const SIGIL_MAP = {
  circuit: SigilCircuit,
  hexnode: SigilHexNode,
  crosshair: SigilCrosshair,
  diamond: SigilDiamond,
  delta: SigilDelta,
  scan: SigilScan,
};
