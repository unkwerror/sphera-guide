/* ═══════════════════════════════════════════════════════════════
   GLYPH SYSTEM — barrel export
   ─────────────────────────────────────────────────────────────

   FAMILY ROLES & PLACEMENT GUIDE
   ───────────────────────────────

   ┌─────────────────┬──────────────────────────────────────────┐
   │ CONTEXT          │ ELEMENTS                                │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Navigation       │ SigilCircuit (logo area marker)         │
   │                  │ BracketOrnament [>>] (tab prefix)       │
   │                  │ StatusDot (nav CTA indicator)            │
   │                  │ MonoBadge variant="accent" (nav badge)   │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Section Headers  │ SectionGhostNum (large faint 01, 02…)   │
   │                  │ DividerNodeLine (below section title)    │
   │                  │ DividerCircuitTrace (alt, PCB style)     │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Content Panels   │ PanelCorners (structural corner marks)   │
   │                  │ CardTopAccent (accent/gold top line)     │
   │                  │ CardGlyphWatermark (bg sigil, 6% opa)   │
   │                  │ CardIndexNum (ghost index like 01, 02)   │
   │                  │ SigilDiamond (inline marker beside text) │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Sfera Mock UI    │ TerminalFrame (panel with title bar)     │
   │                  │ StatusBadge (task status indicators)      │
   │                  │ SigilHexNode (module/node markers)       │
   │                  │ SigilCrosshair (active/focus items)      │
   │                  │ SigilScan (monitoring/tracking sections) │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Bullet Lists     │ SigilBullet (6 types: diamond, square,  │
   │                  │   cross, circuit, arrow, dot)            │
   │                  │ SigilList (drop-in <ul> replacement)     │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Separators       │ DividerNodeLine (primary)                │
   │                  │ DividerCircuitTrace (technical sections) │
   │                  │ DividerGoldRitual (1-2 per page, ritual) │
   │                  │ DividerDashedTerminal (light separator)  │
   │                  │ DividerBracket (terminal-style [···])    │
   ├─────────────────┼──────────────────────────────────────────┤
   │ Ambient / Y2K    │ ScanlineOverlay (fixed, full-screen)     │
   │                  │ BracketFrame (retro bracket boundary)    │
   │                  │ CursorBlink (terminal cursor)            │
   │                  │ AsciiCat, AsciiBox (hidden micro-charm)  │
   ├─────────────────┼──────────────────────────────────────────┤
   │ CTA / Ritual     │ DividerGoldRitual (top of CTA panel)     │
   │                  │ CardTopAccent color="gold" (ritual mark) │
   │                  │ MonoBadge variant="gold" (rare)          │
   │                  │ SigilDelta (hierarchy/structure marker)   │
   └─────────────────┴──────────────────────────────────────────┘

   SIGIL FAMILIES
   ──────────────
   A · Node (systems/connections): Circuit, HexNode, Crosshair
   B · Marker (hierarchy/status):  Diamond, Delta
   C · Sensor (observation):       Scan

   ═══════════════════════════════════════════════════════════════ */

// Sigils
export {
  SigilCircuit,
  SigilHexNode,
  SigilCrosshair,
  SigilDiamond,
  SigilDelta,
  SigilScan,
  SIGIL_FAMILIES,
  SIGIL_MAP,
} from './Sigils';

// Dividers
export {
  DividerNodeLine,
  DividerCircuitTrace,
  DividerGoldRitual,
  DividerDashedTerminal,
  DividerBracket,
} from './Dividers';

// Corners
export {
  CornerMark,
  PanelCorners,
} from './Corners';

// Terminal Markers
export {
  CursorBlink,
  BracketOrnament,
  StatusDot,
  PromptMarker,
  TerminalLine,
} from './Markers';

// Bullets
export {
  SigilBullet,
  SigilList,
} from './Bullets';

// Badges
export {
  MonoBadge,
  StatusBadge,
} from './Badges';

// Card Decorations
export {
  CardTopAccent,
  CardIndexNum,
  CardGlyphWatermark,
  SectionGhostNum,
} from './CardDecor';

// Frames & Overlays
export {
  TerminalFrame,
  BracketFrame,
  ScanlineOverlay,
} from './Frames';
