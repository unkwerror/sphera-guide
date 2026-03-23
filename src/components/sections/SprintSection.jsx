import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode,
  DividerNodeLine, DividerCircuitTrace, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge, StatusBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
  SigilBullet,
} from '../glyphs';


const TIMELINE_STEPS = [
  {
    title: 'Старт спринта',
    marker: '01',
    items: [
      'Планирование: выбрать задачи из бэклога',
      'Оценить трудозатраты (в часах)',
      'Назначить исполнителей на каждую задачу',
      'Проверить, что у всех есть доступ к ресурсам',
    ],
  },
  {
    title: 'Середина',
    marker: '02',
    items: [
      'Стендап: обновить статусы задач',
      'Проверить, нет ли блокеров',
      'Списать время (факт vs оценка)',
      'Перекинуть задачи, если кто-то перегружен',
    ],
  },
  {
    title: 'Конец спринта',
    marker: '03',
    items: [
      'Демо результатов (даже если не всё готово)',
      'Ретро: что пошло не так, что улучшить',
      'Перенести незакрытые задачи в следующий спринт',
      'Обновить бэклог на следующую итерацию',
    ],
  },
];

const KANBAN_COLS = [
  { title: 'ОТКРЫТА', cards: [
    { key: 'ROBOCAR-018', title: 'Настройка SLAM',       assignee: 'Петрова М.', status: 'idle' },
    { key: 'GO2VLM-005',  title: 'Датасет для обучения', assignee: '—',          status: 'idle' },
  ]},
  { title: 'В РАБОТЕ', cards: [
    { key: 'ROBOCAR-015', title: 'PID-регулятор',        assignee: 'Сидоров К.', status: 'active' },
    { key: 'YOUBOT-009',  title: 'Калибровка захвата',   assignee: 'Козлов Д.',  status: 'active' },
  ]},
  { title: 'РЕШЕНА', cards: [
    { key: 'ROBOCAR-012', title: 'Сборка шасси v2',      assignee: 'Козлов Д.',  status: 'done' },
    { key: 'YOUBOT-007',  title: 'ROS2 launch файлы',    assignee: 'Петрова М.', status: 'done' },
  ]},
];

const DONT_DO = [
  'Менять задачи посреди спринта без обсуждения с командой',
  'Оставлять спринт без демо — даже незаконченная работа показывается',
  'Создавать задачи без оценки и срока',
  'Игнорировать блокеры — если застрял, пиши сразу',
  'Назначать себе 40 часов работы в двухнедельный спринт',
];

const STANDUP_DO = [
  'Что сделал вчера',
  'Что буду делать сегодня',
  'Есть ли блокеры',
];

const STANDUP_DONT = [
  'Пересказывать всю историю проекта',
  'Обсуждать архитектурные решения (это отдельная встреча)',
  'Молчать, если застрял',
];

const SPRINT_GUIDE_STEPS = [
  'Открой нужное пространство и перейди в раздел «Бэклог»',
  'В правом верхнем углу панели спринтов нажми «Добавить спринт +»',
  'В выпадающем меню нажми «Создать спринт»',
  'Заполни поля: Пространство, Название (до 125 символов), Статус (Планируемый)',
  'Выбери уровень иерархии: Спринт или Суперспринт',
  'Укажи Дату начала и Дату завершения',
  'Нажми «Сохранить» — спринт появится в панели сверху',
  'Чтобы добавить задачу в спринт: открой карточку задачи → поле «Спринт» справа → выбери созданный спринт из списка',
  'Или в бэклоге: отметь задачи галочками → нажми «В спринт» → выбери спринт',
];

const STATUS_MAP = { active: 'active', warning: 'warning', idle: 'idle', done: 'done' };
const STATUS_LABELS = { active: 'В работе', warning: 'Ревью', idle: 'Бэклог', done: 'Готово' };


export default function SprintSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });

  return (
    <>
      <style>{CSS}</style>
      <section id="sprint" ref={containerRef} className="sp">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="05" />
            <h2 className="ds-section-title">Ритм работы: спринт и канбан</h2>
          </div>

          <p className="sp-intro">
            Двухнедельный спринт — лучший компромисс для учебных проектов.
            Достаточно длинный, чтобы сделать что-то реальное.
            Достаточно короткий, чтобы не потерять фокус. Вот как это работает.
          </p>

          <div className="sp-divider">
            <DividerCircuitTrace />
          </div>

          {/* ── TIMELINE ── */}
          <div data-reveal className="sp-timeline-wrap motion-reveal">
            <div className="sp-timeline-label">
              <SigilHexNode size={18} color="var(--color-accent)" />
              <span>2 недели — один цикл</span>
            </div>
            <div className="sp-timeline">
              {TIMELINE_STEPS.map((step, i) => (
                <div key={step.marker} className="sp-timeline-step">
                  <div className="sp-timeline-marker">
                    <span className="sp-timeline-num">{step.marker}</span>
                    {i < TIMELINE_STEPS.length - 1 && <span className="sp-timeline-connector" />}
                  </div>
                  <div className="sp-timeline-body">
                    <h3 className="sp-timeline-title">{step.title}</h3>
                    <ul className="sp-timeline-list">
                      {step.items.map((item, j) => (
                        <li key={j} className="sp-timeline-item">
                          <SigilBullet type="diamond" size={8} color="var(--color-accent)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── KANBAN MOCK ── */}
          <div data-reveal className="sp-kanban-wrap motion-panel">
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div className="sp-kanban-mock">
                <CardTopAccent color="var(--color-accent)" width={48} />
                <div className="sp-kanban-header">
                  <StatusDot status="active" size={6} />
                  <BracketOrnament text=">>" color="var(--color-accent)" />
                  <span className="sp-kanban-title">Канбан · Спринт 2</span>
                </div>
                <div className="sp-kanban-toolbar">
                  <div className="sp-kanban-select">Спринт 1</div>
                  <div className="sp-kanban-select">Группировать по</div>
                </div>
                <div className="sp-kanban">
                  {KANBAN_COLS.map((col) => (
                    <div key={col.title} className="sp-kanban-col">
                      <div className="sp-kanban-col-head">
                        <span className="sp-kanban-col-name">{col.title}</span>
                        <MonoBadge variant="default">{col.cards.length}</MonoBadge>
                      </div>
                      {col.cards.map((card) => (
                        <div key={card.key} className="sp-kanban-card motion-border">
                          <div className="sp-kanban-card-top">
                            <MonoBadge variant="ghost">{card.key}</MonoBadge>
                            <StatusBadge status={STATUS_MAP[card.status]} label={STATUS_LABELS[card.status]} />
                          </div>
                          <span className="sp-kanban-card-title">{card.title}</span>
                          <span className="sp-kanban-card-assignee">{card.assignee}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <CardGlyphWatermark glyph="circuit" size={160} />
              </div>
            </PanelCorners>
          </div>

          {/* ── DONT DO ── */}
          <div data-reveal className="sp-block motion-reveal">
            <div className="sp-block-header">
              <StatusDot status="error" size={8} />
              <span className="sp-block-title sp-block-title--bad">Чего нельзя делать</span>
            </div>
            <div className="sp-block-list">
              {DONT_DO.map((item, i) => (
                <div key={i} className="sp-block-item sp-block-item--bad">
                  <SigilBullet type="cross" size={12} color="var(--color-error)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── STANDUP ── */}
          <div data-reveal className="sp-standup-wrap motion-panel">
            <PanelCorners size={14} color="var(--color-border-strong)">
              <div className="sp-standup">
                <CardTopAccent color="var(--color-accent-gold)" width={40} />
                <h3 className="sp-standup-title">Стендап</h3>
                <p className="sp-standup-desc">
                  5 минут в начале рабочего дня. Не дискуссия, не планёрка. Три вопроса — и к работе.
                </p>

                <div className="sp-standup-grid">
                  <div className="sp-standup-col">
                    <div className="sp-standup-col-head">
                      <StatusDot status="done" size={6} />
                      <span>Говори</span>
                    </div>
                    {STANDUP_DO.map((item, i) => (
                      <div key={i} className="sp-standup-item">
                        <SigilBullet type="diamond" size={8} color="var(--color-success)" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sp-standup-col">
                    <div className="sp-standup-col-head">
                      <StatusDot status="error" size={6} />
                      <span>Не говори</span>
                    </div>
                    {STANDUP_DONT.map((item, i) => (
                      <div key={i} className="sp-standup-item">
                        <SigilBullet type="cross" size={8} color="var(--color-error)" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PanelCorners>
          </div>

          {/* ── SPRINT GUIDE ── */}
          <div data-reveal className="sp-guide-wrap motion-reveal">
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div className="sp-guide">
                <CardTopAccent color="var(--color-accent)" width={48} />
                <h3 className="sp-guide-title">Как создать спринт в Сфере</h3>
                <ul className="sp-guide-list">
                  {SPRINT_GUIDE_STEPS.map((text, i) => (
                    <li key={i} className="sp-guide-step">
                      <span className="sp-guide-num">{String(i + 1).padStart(2, '0')}</span>
                      <SigilDiamond size={8} color="var(--color-accent)" />
                      <span className="sp-guide-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PanelCorners>
          </div>

          <div data-reveal className="sp-guide-tip motion-reveal">
            <p className="sp-guide-tip-text">
              Сначала чисти бэклог, потом создавай спринт. Если делать наоборот, в спринт улетает слишком много мусора.
            </p>
          </div>

          {/* ── CLOSING QUOTE ── */}
          <div data-reveal className="sp-quote motion-reveal">
            <DividerDashedTerminal />
            <blockquote className="sp-quote-text">
              <SigilDiamond size={10} color="var(--color-accent-gold)" />
              <span>Спринт — это не бюрократия. Это способ договориться.</span>
            </blockquote>
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
  .sp {
    position: relative;
    padding-top: 2rem;
  }

  .sp-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  .sp-divider {
    margin-bottom: 3rem;
    max-width: 600px;
  }

  /* ── TIMELINE ── */

  .sp-timeline-wrap { margin-bottom: 3rem; }

  .sp-timeline-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
  }

  .sp-timeline {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    position: relative;
  }

  .sp-timeline-step {
    position: relative;
    padding: 0 1.5rem;
  }

  .sp-timeline-step:not(:last-child) {
    border-right: 1px solid var(--color-border);
  }

  .sp-timeline-marker {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 1.25rem;
    position: relative;
  }

  .sp-timeline-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--color-accent);
    color: var(--color-bg);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .sp-timeline-connector {
    position: absolute;
    right: -1.5rem;
    top: 50%;
    width: 3rem;
    height: 1px;
    background: var(--color-border);
    transform: translateX(0);
    z-index: 1;
  }

  .sp-timeline-title {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text);
    margin: 0 0 1rem;
  }

  .sp-timeline-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .sp-timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .sp-timeline-item > svg { flex-shrink: 0; margin-top: 3px; }

  /* ── KANBAN MOCK ── */

  .sp-kanban-wrap { margin-bottom: 3rem; }

  .sp-kanban-mock {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .sp-kanban-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-raised);
  }

  .sp-kanban-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .sp-kanban-toolbar {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem 0;
    flex-wrap: wrap;
  }

  .sp-kanban-select {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    min-width: 116px;
  }

  .sp-kanban {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--color-border);
    margin: 1px;
  }

  .sp-kanban-col {
    background: var(--color-bg-raised);
    padding: 1rem;
  }

  .sp-kanban-col-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sp-kanban-col-name {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .sp-kanban-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    transition: border-color var(--transition-fast);
  }

  .sp-kanban-card:hover { border-color: var(--color-accent); }

  .sp-kanban-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .sp-kanban-card-title {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text);
    font-weight: 500;
    line-height: 1.4;
  }

  .sp-kanban-card-assignee {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-tertiary);
  }

  /* ── DONT DO ── */

  .sp-block {
    margin-bottom: 3rem;
    max-width: 680px;
  }

  .sp-block-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
  }

  .sp-block-title {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .sp-block-title--bad { color: var(--color-error); }

  .sp-block-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .sp-block-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 0.875rem 1.25rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    transition: border-color var(--transition-fast);
  }

  .sp-block-item:hover { border-color: var(--color-border-strong); }

  .sp-block-item--bad {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .sp-block-item > svg { flex-shrink: 0; margin-top: 3px; }

  /* ── STANDUP ── */

  .sp-standup-wrap { margin-bottom: 3rem; max-width: 800px; }

  .sp-standup {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 2rem;
    overflow: hidden;
  }

  .sp-standup-title {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text);
    margin: 0 0 0.75rem;
  }

  .sp-standup-desc {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }

  .sp-standup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .sp-standup-col {
    background: var(--color-bg-raised);
    padding: 1.25rem;
  }

  .sp-standup-col-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sp-standup-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .sp-standup-item > svg { flex-shrink: 0; margin-top: 3px; }

  /* ── SPRINT GUIDE ── */

  .sp-guide-wrap { margin-bottom: 1.5rem; max-width: 800px; }

  .sp-guide {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.75rem 2rem 2rem;
    overflow: hidden;
  }

  .sp-guide-title {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text);
    margin: 0 0 1.25rem;
  }

  .sp-guide-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .sp-guide-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .sp-guide-num {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    min-width: 1.5rem;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .sp-guide-step > svg { flex-shrink: 0; margin-top: 4px; }

  .sp-guide-text {
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  .sp-guide-tip {
    margin-bottom: 2rem;
    max-width: 800px;
    padding: 1rem 1.25rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
  }

  .sp-guide-tip-text {
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-accent-gold);
    line-height: 1.6;
    margin: 0;
  }

  /* ── QUOTE ── */

  .sp-quote { margin-top: 3rem; max-width: 680px; }

  .sp-quote-text {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    font-style: italic;
    margin: 1.5rem 0 0;
    padding: 0;
    border: none;
  }

  .sp-quote-text > svg { flex-shrink: 0; }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .sp-timeline { grid-template-columns: 1fr; gap: 2rem; }
    .sp-timeline-step { padding: 0; border-right: none !important; }
    .sp-timeline-connector { display: none; }
    .sp-kanban { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 640px) {
    .sp-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.5rem;
    }
    .sp-kanban { grid-template-columns: 1fr; }
    .sp-standup-grid { grid-template-columns: 1fr; }
    .sp-standup { padding: 1.25rem; }
    .sp-kanban-header { padding: 0.75rem 1rem; }
    .sp-kanban-toolbar { padding: 0.75rem 1rem 0; }
    .sp-kanban-select { width: 100%; }
    .sp-timeline-step { padding: 0; }
    .sp-block-item { padding: 0.75rem 1rem; }
    .sp-guide { padding: 1.25rem 1.25rem 1.5rem; }
    .sp-guide-title { font-size: 0.88rem; }
    .sp-timeline-title { font-size: 0.92rem; }
    .sp-timeline-item,
    .sp-guide-text,
    .sp-standup-item {
      font-size: 0.86rem;
      line-height: 1.55;
    }
    .sp-kanban-col-name {
      font-size: 0.76rem;
    }
    .sp-kanban-card-title {
      font-size: 0.82rem;
      line-height: 1.45;
    }
    .sp-guide-tip { padding: 0.875rem 1rem; }
    .sp-guide-tip-text {
      font-size: 0.84rem;
      line-height: 1.55;
    }
  }
`;
