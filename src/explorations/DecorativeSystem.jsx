/* ═══════════════════════════════════════════════════════════════
   DECORATIVE SYSTEM — living showcase
   ─────────────────────────────────────────────────────────────
   Imports from production glyph modules in src/components/.
   Serves as a visual catalog for review. Not a page component.
   ═══════════════════════════════════════════════════════════════ */

import {
  SigilCircuit, SigilDiamond, SigilHexNode, SigilCrosshair, SigilDelta, SigilScan,
  DividerNodeLine, DividerCircuitTrace, DividerGoldRitual, DividerDashedTerminal, DividerBracket,
  CornerMark, PanelCorners,
  CursorBlink, BracketOrnament, StatusDot, PromptMarker, TerminalLine,
  SigilBullet, SigilList,
  MonoBadge, StatusBadge,
  CardTopAccent, CardIndexNum, CardGlyphWatermark, SectionGhostNum,
  TerminalFrame, BracketFrame,
} from '../components/glyphs';

import {
  AsciiCat, AsciiArrow, AsciiBox, AsciiSeparator, AsciiBlock,
} from '../components/ascii';


const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    padding: '3rem',
    fontFamily: 'var(--font-body)',
  },
  wrap: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  h1: {
    fontFamily: 'var(--font-body)',
    fontSize: '2rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-text)',
    margin: 0,
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 1,
    background: 'var(--color-border)',
    border: '1px solid var(--color-border)',
  },
  cell: {
    background: 'var(--color-surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '2rem 1rem',
  },
  cellLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-tertiary)',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: '2rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
  },
  divItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  demoCard: {
    position: 'relative',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
    overflow: 'hidden',
  },
};


export default function DecorativeSystem() {
  return (
    <div style={S.root}>
      <div style={S.wrap}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <MonoBadge variant="ghost">PRODUCTION GLYPH KIT</MonoBadge>
          <h1 style={S.h1}>Decorative System</h1>
          <div style={{ maxWidth: 300, width: '100%' }}>
            <DividerGoldRitual />
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            Magic Inside Concrete · Glyph families A / B / C
          </p>
        </div>

        {/* ── 1. SVG SIGIL GLYPHS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>SVG Sigil Glyphs — 3 families, 6 glyphs</span>
          </div>
          <div style={S.grid}>
            {[
              ['CIRCUIT', SigilCircuit, 48, 'A · Node'],
              ['HEX_NODE', SigilHexNode, 36, 'A · Node'],
              ['CROSSHAIR', SigilCrosshair, 32, 'A · Node'],
              ['DIAMOND', SigilDiamond, 36, 'B · Marker'],
              ['DELTA', SigilDelta, 36, 'B · Marker'],
              ['SCAN', SigilScan, 40, 'C · Sensor'],
            ].map(([label, Comp, sz, family]) => (
              <div key={label} style={S.cell}>
                <Comp size={sz} color="var(--color-accent)" />
                <span style={S.cellLabel}>{label}</span>
                <span style={{ ...S.cellLabel, fontSize: '0.5rem', color: 'var(--color-text-tertiary)', opacity: 0.6 }}>{family}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. SECTION DIVIDERS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Section Dividers</span>
          </div>
          <div style={S.panel}>
            {[
              ['NODE_LINE', DividerNodeLine, 'primary section break'],
              ['CIRCUIT_TRACE', DividerCircuitTrace, 'technical sections'],
              ['GOLD_RITUAL', DividerGoldRitual, 'max 1–2 per page'],
              ['DASHED_TERMINAL', DividerDashedTerminal, 'light separator'],
              ['BRACKET', DividerBracket, 'terminal-style pause'],
            ].map(([label, Comp, usage]) => (
              <div key={label} style={S.divItem}>
                <div style={S.row}>
                  <span style={S.cellLabel}>{label}</span>
                  <span style={{ ...S.cellLabel, fontSize: '0.5rem', opacity: 0.5 }}>{usage}</span>
                </div>
                <Comp />
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. CORNER DECORATIONS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Corner Decorations</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
            <div style={{ ...S.cell, padding: '3rem' }}>
              <PanelCorners size={20} color="var(--color-accent)">
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  Panel with corner marks
                </div>
              </PanelCorners>
              <span style={S.cellLabel}>PANEL_CORNERS</span>
            </div>
            <div style={{ ...S.cell, padding: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {['tl', 'tr', 'bl', 'br'].map(pos => (
                  <div key={pos} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <CornerMark position={pos} size={24} color="var(--color-accent)" />
                    <span style={{ ...S.cellLabel, fontSize: '0.55rem' }}>{pos.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <span style={S.cellLabel}>INDIVIDUAL CORNERS</span>
            </div>
          </div>
        </section>

        {/* ── 4. TERMINAL MARKERS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Terminal Markers</span>
          </div>
          <TerminalFrame title="sys.decorative.markers">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={S.row}>
                <span style={S.cellLabel}>CURSOR_BLINK</span>
                <CursorBlink />
              </div>
              <div style={S.row}>
                <span style={S.cellLabel}>BRACKET_ORNAMENT</span>
                <BracketOrnament text=">>" />
                <BracketOrnament text="--" color="var(--color-text-tertiary)" />
                <BracketOrnament text="::" color="var(--color-accent-gold)" />
              </div>
              <div style={S.row}>
                <span style={S.cellLabel}>STATUS_DOTS</span>
                <StatusDot status="active" />
                <StatusDot status="done" />
                <StatusDot status="warning" />
                <StatusDot status="error" />
                <StatusDot status="idle" />
                <StatusDot status="gold" />
              </div>
              <div style={S.row}>
                <span style={S.cellLabel}>PROMPT_MARKER</span>
                <PromptMarker prefix=">" />
                <PromptMarker prefix="$" />
                <PromptMarker prefix="::" color="var(--color-accent)" />
              </div>
              <div style={{ marginTop: 8 }}>
                <TerminalLine prefix="$" text="sfera --init project" />
                <TerminalLine prefix=">" text="loading task backlog..." />
                <TerminalLine prefix="::" text="ready" />
              </div>
            </div>
          </TerminalFrame>
        </section>

        {/* ── 5. BULLET REPLACEMENTS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Sigil Bullets</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
            <div style={{ ...S.cell, alignItems: 'flex-start', padding: '2rem' }}>
              <span style={S.cellLabel}>BULLET TYPES</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                {['diamond', 'square', 'cross', 'circuit', 'arrow', 'dot'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <SigilBullet type={t} size={10} color="var(--color-accent)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-secondary)', letterSpacing: '0.06em' }}>{t.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...S.cell, alignItems: 'flex-start', padding: '2rem' }}>
              <span style={S.cellLabel}>SIGIL LIST</span>
              <div style={{ marginTop: 8 }}>
                <SigilList
                  bulletType="diamond"
                  items={[
                    'Создайте задачу в бэклоге',
                    'Назначьте исполнителя и срок',
                    'Декомпозируйте на подзадачи',
                    'Трекайте время выполнения',
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. BADGES & TAGS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Badges & Tags</span>
          </div>
          <div style={S.panel}>
            <div>
              <span style={S.cellLabel}>MONO BADGES</span>
              <div style={{ ...S.row, marginTop: 10 }}>
                <MonoBadge variant="default">SYSTEM</MonoBadge>
                <MonoBadge variant="accent">ACTIVE</MonoBadge>
                <MonoBadge variant="ghost">PROTOCOL</MonoBadge>
                <MonoBadge variant="gold">RITUAL</MonoBadge>
              </div>
            </div>
            <div>
              <span style={S.cellLabel}>STATUS BADGES</span>
              <div style={{ ...S.row, marginTop: 10 }}>
                <StatusBadge status="active" label="В работе" />
                <StatusBadge status="done" label="Готово" />
                <StatusBadge status="warning" label="Ревью" />
                <StatusBadge status="error" label="Блокер" />
                <StatusBadge status="idle" label="Бэклог" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. CARD MICRO-DECORATIONS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Card Micro-Decorations</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
            <div style={S.demoCard}>
              <CardTopAccent color="var(--color-accent)" width={40} />
              <CardIndexNum num="01" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '1rem 0 0', lineHeight: 1.6 }}>
                Top accent line — cold steel-blue. Marks first panel.
              </p>
              <CardGlyphWatermark glyph="circuit" />
            </div>
            <div style={S.demoCard}>
              <CardTopAccent color="var(--color-accent-gold)" width={40} />
              <CardIndexNum num="02" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '1rem 0 0', lineHeight: 1.6 }}>
                Gold ritual marker — very sparingly, high-importance.
              </p>
              <CardGlyphWatermark glyph="diamond" />
            </div>
            <div style={S.demoCard}>
              <CardIndexNum num="03" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '1rem 0 0', lineHeight: 1.6 }}>
                Glyph watermark — barely visible depth texture.
              </p>
              <CardGlyphWatermark glyph="hexnode" size={100} />
            </div>
          </div>
        </section>

        {/* ── 8. Y2K TERMINAL NOSTALGIA ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Y2K Terminal Nostalgia</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <TerminalFrame title="terminal.session">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <TerminalLine prefix="$" text="sfera tasks list --sprint=3" />
                <TerminalLine prefix=">" text="[ROB-001] Интеграция PX4 с ROS2     :: В РАБОТЕ" />
                <TerminalLine prefix=">" text="[CV-014]  Датасет для детектора огня  :: СОЗДАНО" />
                <TerminalLine prefix=">" text="[AI-007]  LLM-пайплайн на inference   :: В РАБОТЕ" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <TerminalLine prefix="$" text="" />
                  <CursorBlink />
                </div>
              </div>
            </TerminalFrame>

            <BracketFrame style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.08em',
              }}>
                BRACKET FRAME — subtle retro boundary
              </div>
            </BracketFrame>

            <div style={{
              position: 'relative',
              height: 100,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  rgba(91, 143, 185, 0.03) 0px,
                  transparent 1px,
                  transparent 3px
                )`,
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-accent)',
                letterSpacing: '0.2em',
                position: 'relative',
                zIndex: 1,
              }}>SCANLINE TEXTURE PREVIEW</span>
            </div>
          </div>
        </section>

        {/* ── 9. ASCII MICRO-DETAILS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>ASCII Micro-Details</span>
          </div>
          <div style={S.grid}>
            <div style={S.cell}>
              <AsciiCat />
              <span style={S.cellLabel}>ASCII_CAT</span>
            </div>
            <div style={S.cell}>
              <AsciiBox text="SYS" />
              <span style={S.cellLabel}>ASCII_BOX</span>
            </div>
            <div style={S.cell}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <AsciiArrow direction="right" />
                <AsciiArrow direction="left" />
              </div>
              <span style={S.cellLabel}>ASCII_ARROWS</span>
            </div>
            <div style={S.cell}>
              <AsciiSeparator char="·" count={12} />
              <AsciiSeparator char="─" count={12} />
              <span style={S.cellLabel}>ASCII_SEPARATORS</span>
            </div>
            <div style={S.cell}>
              <AsciiBox text="SFERA" color="var(--color-accent)" />
              <span style={S.cellLabel}>ASCII_BOX_ACCENT</span>
            </div>
            <div style={S.cell}>
              <AsciiBlock />
              <span style={S.cellLabel}>ASCII_BLOCK</span>
            </div>
          </div>
        </section>

        {/* ── 10. SECTION GHOST NUMBERS ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Section Ghost Numbers</span>
          </div>
          <div style={{ ...S.panel, flexDirection: 'row', gap: 48 }}>
            {['01', '02', '03', '04'].map(n => (
              <SectionGhostNum key={n} num={n} />
            ))}
          </div>
        </section>

        {/* ── 11. COMBINED EXAMPLE ── */}
        <section>
          <div style={S.sectionLabel}>
            <BracketOrnament text=">>" />
            <span>Combined Example — Task Card</span>
          </div>
          <div style={{
            position: 'relative',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            <CardTopAccent color="var(--color-accent-gold)" width={60} />
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <SigilDiamond size={16} color="var(--color-accent)" />
                  <MonoBadge variant="accent">ЗАДАЧА</MonoBadge>
                  <StatusBadge status="active" label="В работе" />
                  <div style={{ flex: 1 }} />
                  <CardIndexNum num="ROB-001" />
                </div>
                <DividerNodeLine />
                <h3 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: 'var(--color-text)',
                  margin: '1.5rem 0 1rem',
                }}>
                  Интеграция PX4 с ROS2 для управления приводами
                </h3>
                <SigilList
                  bulletType="diamond"
                  bulletColor="var(--color-accent)"
                  items={[
                    'Настроить mavros bridge между PX4 SITL и ROS2 Humble',
                    'Написать ноду управления actuator_commands',
                    'Провести Hardware-in-the-Loop тестирование',
                  ]}
                />
                <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                  <MonoBadge variant="default">PX4</MonoBadge>
                  <MonoBadge variant="default">ROS2</MonoBadge>
                  <MonoBadge variant="ghost">СПРИНТ 3</MonoBadge>
                </div>
              </div>
            </PanelCorners>
            <CardGlyphWatermark glyph="circuit" size={120} />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
          <DividerBracket />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 }}>
            <StatusDot status="active" size={5} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              GLYPH_KIT_COMPLETE · END_TRANSMISSION
            </span>
            <StatusDot status="active" size={5} />
          </div>
        </div>

      </div>
    </div>
  );
}
