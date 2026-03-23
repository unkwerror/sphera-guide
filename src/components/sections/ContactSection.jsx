import { useState } from 'react';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode,
  DividerNodeLine, DividerGoldRitual, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
  SigilBullet,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';


const FAQ_ITEMS = [
  {
    q: 'Не вижу пространство в Сфере',
    a: 'Проверь, что тебе дали доступ к проекту. Если пространства нет — напиши руководителю или Ивану сразу. Не жди.',
  },
  {
    q: 'Какую задачу создать первой?',
    a: 'Самую ближайшую и конкретную. Не «спроектировать робота», а «собрать шасси» или «настроить ROS2 launch файл». То, что можно сделать за 1-2 дня.',
  },
  {
    q: 'Чем бэклог отличается от канбана?',
    a: 'Бэклог — это очередь: что нужно сделать, но ещё не в работе. Канбан — это движение: что прямо сейчас в каком статусе. Бэклог планирует, канбан показывает поток.',
  },
  {
    q: 'Куда писать блокер?',
    a: 'В комментарий к задаче в Сфере. Не в чат, не в голову. Поставь статус «Заблокировано» и укажи, от чего зависит. Так команда видит проблему, а не угадывает.',
  },
  {
    q: 'Когда списывать время?',
    a: 'В тот же день, когда работал. Даже 30 минут. Если списываешь раз в неделю по памяти — данные бесполезны. Точный учёт = точное планирование.',
  },
];

const LINKS = [
  { label: 'Сфера.Задачи', url: 'https://www.sferaplatform.ru/sfera-zadachi', desc: 'Основной рабочий инструмент' },
  { label: 'SaaS Сфера.Задачи', url: 'https://saas.sferaplatform.ru/products/tasks', desc: 'Продуктовая страница' },
  { label: 'Документация платформы', url: 'https://www.sferaplatform.ru/page71488711.html', desc: 'Справка по интерфейсу' },
  { label: 'ИИР НГУ', url: 'https://education.nsu.ru/mechatronics', desc: 'Институт Интеллектуальной Робототехники' },
];


function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`ct-faq-item ${isOpen ? 'ct-faq-item--open' : ''}`}>
      <button type="button" className="ct-faq-q" onClick={onToggle}>
        <SigilDiamond size={8} color={isOpen ? 'var(--color-accent)' : 'var(--color-text-tertiary)'} />
        <span className="ct-faq-q-text">{item.q}</span>
        <span className="ct-faq-chevron">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="ct-faq-a">
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}


export default function ContactSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{CSS}</style>
      <section id="contact" ref={containerRef} className="ct">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="08" />
            <h2 className="ds-section-title">Контакты и помощь</h2>
          </div>

          <p className="ct-intro">
            Не тяните до дедлайна. Если что-то непонятно, не работает или не получается —
            пишите сразу. Чем раньше вопрос, тем проще решение.
          </p>

          <div className="ds-ascii-strip ds-ascii-strip--soft ds-ascii-strip--compact">
            <AsciiCharm variant="sleepy" size="sm" tone="soft" seed="contact-sleepy" />
            <AsciiCharm variant="spark" size="xs" tone="gold" seed="contact-spark" />
          </div>

          <div className="ct-divider">
            <DividerGoldRitual />
          </div>

          {/* ── CONTACT CARD ── */}
          <div data-reveal className="ct-contact-wrap motion-panel">
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div className="ct-contact">
                <CardTopAccent color="var(--color-accent-gold)" width={48} />
                <div className="ct-contact-inner">
                  <div className="ct-contact-left">
                    <div className="ct-contact-avatar">
                      <SigilHexNode size={32} color="var(--color-accent)" />
                    </div>
                    <div className="ct-contact-info">
                      <h3 className="ct-contact-name">Иван Гришанов</h3>
                      <span className="ct-contact-role">Менеджер по работе со Сферой · ИИР</span>
                    </div>
                  </div>
                  <div className="ct-contact-right">
                    <div className="ct-contact-field">
                      <span className="ct-contact-label">Email</span>
                      <a href="mailto:i.grishanow@gmail.com" className="ct-contact-value ct-contact-link">
                        i.grishanow@gmail.com
                      </a>
                    </div>
                    <div className="ct-contact-field">
                      <span className="ct-contact-label">Telegram</span>
                      <a href="https://t.me/wwww1rt" className="ct-contact-value ct-contact-link" target="_blank" rel="noopener noreferrer">
                        @wwww1rt
                      </a>
                    </div>
                  </div>
                </div>
                <CardGlyphWatermark glyph="hexnode" size={140} />
              </div>
            </PanelCorners>
          </div>

          {/* ── FAQ ── */}
          <div data-reveal className="ct-faq-wrap motion-reveal">
            <div className="ct-faq-label">
              <SigilDiamond size={10} color="var(--color-accent)" />
              <span>Частые вопросы</span>
            </div>
            <div className="ct-faq">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>

          {/* ── LINKS ── */}
          <div data-reveal className="ct-links-wrap motion-reveal">
            <div className="ct-links-label">
              <BracketOrnament text="::" color="var(--color-text-tertiary)" />
              <span>Полезные ссылки</span>
            </div>
            <div className="ct-links">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="ct-link motion-border"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SigilBullet type="arrow" size={10} color="var(--color-accent)" />
                  <div className="ct-link-body">
                    <span className="ct-link-name">{link.label}</span>
                    <span className="ct-link-desc">{link.desc}</span>
                  </div>
                  <MonoBadge variant="ghost">→</MonoBadge>
                </a>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div data-reveal className="ct-cta motion-panel">
            <DividerDashedTerminal />
            <div className="ct-cta-inner">
              <p className="ct-cta-text">
                Всё начинается с первой задачи. Открой Сферу и создай её прямо сейчас.
              </p>
              <a
                href="https://www.sferaplatform.ru/sfera-zadachi"
                className="ds-btn ds-btn--primary motion-glow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть Сферу
              </a>
            </div>
          </div>

          <div style={{ marginTop: '2rem', maxWidth: 500 }}>
            <DividerNodeLine />
          </div>

        </div>
      </section>
    </>
  );
}


const CSS = `
  .ct {
    position: relative;
    padding-top: 2rem;
  }

  .ct-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  .ct-divider {
    margin-bottom: 3rem;
    max-width: 400px;
  }

  /* ── CONTACT CARD ── */

  .ct-contact-wrap {
    margin-bottom: 3rem;
    max-width: 700px;
  }

  .ct-contact {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .ct-contact-inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    padding: 2rem;
    flex-wrap: wrap;
  }

  .ct-contact-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .ct-contact-avatar {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
  }

  .ct-contact-name {
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.25rem;
  }

  .ct-contact-role {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }

  .ct-contact-right {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ct-contact-field {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .ct-contact-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }

  .ct-contact-value {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text);
  }

  .ct-contact-link {
    color: var(--color-accent);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .ct-contact-link:hover {
    color: var(--color-accent-hover);
    text-shadow: var(--glow-accent);
  }

  /* ── FAQ ── */

  .ct-faq-wrap {
    margin-bottom: 3rem;
    max-width: 700px;
  }

  .ct-faq-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 1.25rem;
  }

  .ct-faq {
    border: 1px solid var(--color-border);
    background: var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .ct-faq-item {
    background: var(--color-surface);
  }

  .ct-faq-q {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background var(--transition-fast);
  }

  .ct-faq-q:hover { background: var(--color-surface-hover); }

  .ct-faq-q > svg { flex-shrink: 0; }

  .ct-faq-q-text {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
    flex: 1;
  }

  .ct-faq-item--open .ct-faq-q-text { color: var(--color-accent); }

  .ct-faq-chevron {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
    width: 20px;
    text-align: center;
  }

  .ct-faq-a {
    padding: 0 1.25rem 1.25rem 2.5rem;
  }

  .ct-faq-a p {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.65;
    margin: 0;
  }

  /* ── LINKS ── */

  .ct-links-wrap {
    margin-bottom: 3rem;
    max-width: 700px;
  }

  .ct-links-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  .ct-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ct-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 1rem 1.25rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    text-decoration: none;
    transition: border-color var(--transition-fast), background var(--transition-fast);
  }

  .ct-link:hover {
    border-color: var(--color-accent);
    background: var(--color-surface-hover);
  }

  .ct-link > svg { flex-shrink: 0; }

  .ct-link-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .ct-link-name {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .ct-link-desc {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-tertiary);
  }

  /* ── CTA ── */

  .ct-cta { margin-top: 1rem; }

  .ct-cta-inner {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .ct-cta-text {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
    flex: 1;
    min-width: 240px;
  }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .ct-contact-inner { flex-direction: column; gap: 1.5rem; }
  }

  @media (max-width: 640px) {
    .ct-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.5rem;
    }
    .ct-contact-inner { padding: 1.25rem; }
    .ct-contact-left { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .ct-contact-name { font-size: 1rem; }
    .ct-contact-role {
      font-size: 0.8rem;
      line-height: 1.45;
    }
    .ct-faq-q { padding: 0.875rem 1rem; }
    .ct-faq-q-text {
      font-size: 0.86rem;
      line-height: 1.5;
    }
    .ct-faq-a { padding: 0 1rem 1rem 2rem; }
    .ct-faq-a p {
      font-size: 0.86rem;
      line-height: 1.58;
    }
    .ct-link { padding: 0.875rem 1rem; }
    .ct-link-name { font-size: 0.86rem; }
    .ct-link-desc { font-size: 0.8rem; }
    .ct-cta-inner { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
    .ct-cta-text {
      font-size: 0.94rem;
      line-height: 1.6;
    }
  }
`;
