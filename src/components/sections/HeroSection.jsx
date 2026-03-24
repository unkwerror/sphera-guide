import { useState, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  SigilCircuit, SigilDiamond,
  DividerNodeLine,
  PanelCorners,
  BracketOrnament, StatusDot, CursorBlink, TerminalLine,
  MonoBadge, StatusBadge,
  CardTopAccent, CardGlyphWatermark,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';
import GuideVideo from '../media/GuideVideo';

const TERMINAL_LINES = [
  { prefix: '$', text: 'sfera --checklist' },
  { prefix: '1', text: 'открыть «Мои задачи»' },
  { prefix: '2', text: 'проверить активные карточки' },
  { prefix: '3', text: 'обновить статус, если начал работу' },
  { prefix: '4', text: 'оставить блокер в комментарии, если завис' },
  { prefix: '5', text: 'списать время после работы' },
  { prefix: '✓', text: 'готово. ты уже лучше 80% команд.', status: 'active' },
];

const HERO_OVERVIEW_VIDEO = '/media/sfera/bystryobzor.webm';

export default function HeroSection() {
  const revealRef = useScrollReveal({ threshold: 0.1 });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisibleLines(TERMINAL_LINES.length);
      return;
    }
    const timer = setTimeout(() => setVisibleLines(v => v + 1), 320);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <>
      <style>{CSS}</style>
      <section ref={revealRef} className="hero motion-reveal" id="hero">
        <div className="hero-gold-line" />

        <div className="hero-inner">
          <div className="hero-content">

            {/* ── TOP BADGE ── */}
            <div className="hero-badge-row">
              <SigilCircuit size={18} color="var(--color-accent)" />
              <MonoBadge variant="ghost">ИИР · Мехатроника и робототехника</MonoBadge>
            </div>

            {/* ── HEADLINE ── */}
            <h1 className="hero-headline">
              Сфера.<br />
              Без паники.
            </h1>

            <p className="hero-sub">
              Уже середина семестра, а в Сфере пусто. Знакомо?
            </p>

            <div className="ds-ascii-strip ds-ascii-strip--soft ds-ascii-strip--hero">
              <AsciiCharm variant="kickoffHard" size="lg" tone="accent" seed="hero-hard" />
              <AsciiCharm variant="spark" size="xs" tone="gold" seed="hero-spark" />
            </div>

            {/* ── DESCRIPTION ── */}
            <p className="hero-desc">
              Непонятно, с чего начинать. Таск-трекинг бесит. Команда буксует.
              Этот сайт — рабочий гайд, чтобы быстро понять,
              что именно делать в Сфера.Задачи и как не развалить проект по дороге.
              Если в голове уже @#$% и «мы ничего не успеваем» — отлично, это и есть точка старта.
            </p>

            {/* ── CALLOUT ── */}
            <div className="hero-callout">
              <SigilDiamond size={8} color="var(--color-accent-gold)" />
              <span>Это не презентация продукта. Это рабочий инструмент для студентов,
              которые хотят быстро разобраться, как в Сфере вести проект по-взрослому.</span>
            </div>

            {/* ── CTA ── */}
            <div className="hero-cta-row">
              <button type="button" className="ds-btn ds-btn--primary motion-glow"
                onClick={() => document.getElementById('first-steps')?.scrollIntoView({ behavior: 'smooth' })}>
                С чего начать
              </button>
              <button type="button" className="ds-btn ds-btn--secondary motion-border"
                onClick={() => document.getElementById('screens')?.scrollIntoView({ behavior: 'smooth' })}>
                Как устроен интерфейс
              </button>
            </div>

            <div className="hero-divider">
              <DividerNodeLine />
            </div>
          </div>

          {/* ── TERMINAL PANEL ── */}
          <div className="hero-terminal-wrap motion-panel motion-visible">
            <div className="hero-terminal">
              <CardTopAccent color="var(--color-accent)" width={48} />
              <PanelCorners size={14} color="var(--color-border-strong)">
                <div className="hero-terminal-inner">

                  <div className="hero-terminal-header">
                    <StatusDot status="error" size={5} />
                    <BracketOrnament text="::" color="var(--color-text-tertiary)" />
                    <span className="hero-terminal-title">sfera.tasks / live</span>
                  </div>

                  <div className="hero-terminal-body motion-type">
                    {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
                      const color = line.status === 'error'
                        ? 'var(--color-error)'
                        : line.status === 'warning'
                          ? 'var(--color-warning)'
                          : 'var(--color-text-secondary)';
                      return (
                        <TerminalLine
                          key={i}
                          prefix={line.prefix}
                          text={line.text}
                          color={color}
                        />
                      );
                    })}
                    {visibleLines >= TERMINAL_LINES.length && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <TerminalLine prefix="$" text="" />
                        <CursorBlink />
                      </div>
                    )}
                  </div>

                  <div className="hero-terminal-footer">
                    <StatusBadge status="active" label="5 шагов" />
                    <span className="hero-terminal-hint">
                      Это твой ежедневный чек-лист в Сфере.
                    </span>
                  </div>
                </div>
              </PanelCorners>
              <CardGlyphWatermark glyph="circuit" size={140} />
            </div>

            <GuideVideo
              className="hero-video-block"
              src={HERO_OVERVIEW_VIDEO}
              badge="hero / webm"
              title="Быстрый обзор интерфейса Сферы"
              caption="Смотри на общую механику: пространство, вход в «Мои задачи» и стартовый рабочий контекст."
              accent="var(--color-accent-gold)"
            />
          </div>
        </div>

      </section>
    </>
  );
}


const CSS = `
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rem 3rem 4rem;
    overflow: hidden;
  }

  .hero-gold-line {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-accent-gold), transparent);
    box-shadow: var(--glow-gold);
  }

  .hero-inner {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .hero-badge-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2rem;
  }

  .hero-headline {
    font-family: var(--font-mono);
    font-size: clamp(2.5rem, 5.5vw, 4.5rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.1;
    color: var(--color-text);
    margin: 0 0 1rem;
  }

  .hero-sub {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-accent);
    margin: 0 0 2rem;
    text-shadow: var(--glow-accent);
  }

  .hero-desc {
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 0 2rem;
  }

  .hero-pains {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2.5rem;
  }

  .hero-pain {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .hero-callout {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 1rem 1.25rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    margin-bottom: 2rem;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    font-style: italic;
  }
  .hero-callout > svg { flex-shrink: 0; margin-top: 3px; }

  .hero-cta-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .hero-divider {
    max-width: 400px;
  }

  /* ── TERMINAL ── */

  .hero-terminal-wrap {
    position: relative;
  }

  .hero-video-block {
    margin-top: 1rem;
    margin-bottom: 0;
  }


  .hero-terminal {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .hero-terminal-inner {
    padding: 1.75rem;
  }

  .hero-terminal-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .hero-terminal-title {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }

  .hero-terminal-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 200px;
  }

  .hero-terminal-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .hero-terminal-hint {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .hero-inner {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .hero {
      padding: 5rem 1.5rem 3rem;
    }
  }

  @media (max-width: 640px) {
    .hero {
      padding: 4.5rem 1rem 2.4rem;
      min-height: auto;
    }
    .hero-headline {
      font-size: 2rem;
    }
    .hero-sub {
      font-size: 0.92rem;
      letter-spacing: 0.04em;
      line-height: 1.45;
      margin-bottom: 1.25rem;
    }
    .hero-desc {
      font-size: 0.98rem;
      line-height: 1.65;
      margin-bottom: 1.35rem;
    }
    .hero-callout {
      padding: 0.9rem 0.95rem;
      font-size: 0.82rem;
      margin-bottom: 1.2rem;
    }
    .hero-terminal-inner {
      padding: 1.1rem;
    }
    .hero-terminal-body {
      min-height: 150px;
    }
    .hero-video-block {
      margin-top: 0.8rem;
    }
    .hero-cta-row {
      flex-direction: column;
    }
    .hero-cta-row .ds-btn {
      width: 100%;
      text-align: center;
    }
  }
`;
