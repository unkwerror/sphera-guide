import { useState } from 'react';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilCrosshair, SigilDiamond,
  DividerNodeLine, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge, StatusBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';

const MOCK_NAV = ['Задачи', 'Бэклог', 'Канбан', 'Структура задач'];
const MOCK_FILTERS = [
  { id: 'tracked', label: 'Отслеживаемые' },
  { id: 'active', label: 'Активные' },
  { id: 'planned', label: 'Планируемые' },
  { id: 'done', label: 'Завершенные' },
  { id: 'unplanned', label: 'Незапланированные' },
];

const MOCK_TASKS = [
  {
    key: 'ROB-001',
    title: 'Сборка шасси робота',
    sprint: 'Спринт 1',
    priority: 'high',
    status: 'active',
    assignee: 'Иванов А.',
    watcher: 'Ты +2',
    flow: 'active',
    tracked: true,
  },
  {
    key: 'ROB-002',
    title: 'Калибровка LiDAR VLP-16',
    sprint: 'Спринт 1',
    priority: 'medium',
    status: 'active',
    assignee: 'Петрова М.',
    watcher: 'Ты',
    flow: 'active',
    tracked: true,
  },
  {
    key: 'ROB-003',
    title: 'Интеграция ROS2-навигации',
    sprint: 'Спринт 1',
    priority: 'high',
    status: 'warning',
    assignee: 'Сидоров К.',
    watcher: 'Команда',
    flow: 'active',
    tracked: false,
  },
  {
    key: 'ROB-004',
    title: 'Unit-тесты PID-регулятора',
    sprint: 'Спринт 2',
    priority: 'low',
    status: 'idle',
    assignee: '—',
    watcher: 'Ты',
    flow: 'planned',
    tracked: true,
  },
  {
    key: 'ROB-005',
    title: 'Создать структуру задач для review',
    sprint: '—',
    priority: 'medium',
    status: 'warning',
    assignee: 'Иванов А.',
    watcher: 'Ты +1',
    flow: 'unplanned',
    tracked: true,
  },
  {
    key: 'ROB-006',
    title: 'Документация API контроллеров',
    sprint: 'Спринт 1',
    priority: 'medium',
    status: 'done',
    assignee: 'Козлов Д.',
    watcher: 'Команда',
    flow: 'done',
    tracked: false,
  },
];

const FILTER_MATCHERS = {
  tracked: (task) => task.tracked,
  active: (task) => task.flow === 'active',
  planned: (task) => task.flow === 'planned',
  done: (task) => task.flow === 'done',
  unplanned: (task) => task.flow === 'unplanned',
};

const PRIORITY_MAP = {
  high:   { label: 'Высокий', color: 'var(--color-error)' },
  medium: { label: 'Средний', color: 'var(--color-warning)' },
  low:    { label: 'Низкий',  color: 'var(--color-text-tertiary)' },
};

const STATUS_MAP = {
  active:  'active',
  warning: 'warning',
  idle:    'idle',
  done:    'done',
  error:   'error',
};

const STATUS_LABELS = {
  active:  'В работе',
  warning: 'Открыта',
  idle:    'Бэклог',
  done:    'Завершена',
  error:   'Просрочена',
};

const ANNOTATIONS = [
  { num: 1, title: 'Вкладка «Активные»', desc: 'Твой ежедневный экран. Здесь видны задачи, которые сейчас в работе. Начинай день с неё.' },
  { num: 2, title: 'Ключ задачи', desc: 'ROB-001, ROB-002… — уникальный ID. Используй его в коммитах и при обсуждении с командой.' },
  { num: 3, title: 'Приоритет и статус', desc: 'Обновляй статус каждый день. Приоритет задаёт руководитель — не игнорируй «Высокий».' },
  { num: 4, title: 'Создать задачу', desc: 'Появилась новая работа? Не держи в голове — создай задачу и назначь исполнителя.' },
];


function CalloutMarker({ num }) {
  return (
    <span className="fs-callout-marker" aria-label={`Аннотация ${num}`}>
      {num}
    </span>
  );
}


export default function FirstStepsSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });
  const [activeFilter, setActiveFilter] = useState('active');
  const visibleTasks = MOCK_TASKS.filter(FILTER_MATCHERS[activeFilter]);

  return (
    <>
      <style>{CSS}</style>
      <section ref={containerRef} className="fs" id="first-steps">
        <div className="ds-section">

          {/* ── SECTION HEADER ── */}
          <div className="ds-section-header">
            <SectionGhostNum num="02" />
            <h2 className="ds-section-title">Что делать первым</h2>
          </div>

          <p className="fs-intro">
            Ты открыл Sfera.Tasks и видишь пустой экран. Без паники.
            Вот что нужно сделать в первые 10 минут — и что смотреть каждый день.
          </p>

          <div className="ds-ascii-strip ds-ascii-strip--compact">
            <AsciiCharm variant="peek" size="sm" tone="soft" seed="steps-peek" />
            <AsciiCharm variant="wave" size="xs" tone="accent" seed="steps-wave" />
          </div>

          <div className="fs-divider">
            <DividerNodeLine />
          </div>

          {/* ── MOCK SFERA INTERFACE ── */}
          <div data-reveal className="fs-mock-wrap motion-panel">
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div className="fs-mock">
                <CardTopAccent color="var(--color-accent)" width={56} />

                {/* Mock Nav */}
                <div className="fs-mock-nav">
                  <div className="fs-mock-nav-left">
                    <StatusDot status="active" size={6} />
                    <span className="fs-mock-project">IRS1 · проект</span>
                  </div>
                  <div className="fs-mock-nav-tabs">
                    {MOCK_NAV.map((tab, i) => (
                      <span key={tab} className={`fs-mock-nav-tab ${i === 0 ? 'fs-mock-nav-tab--active' : ''}`}>
                        {i === 0 && <BracketOrnament text=">>" color="var(--color-accent)" />}
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="fs-mock-nav-right">
                    <CalloutMarker num={4} />
                    <button type="button" className="fs-mock-create-btn">Создать задачу</button>
                  </div>
                </div>

                {/* Mock Title */}
                <div className="fs-mock-title-row">
                  <span className="fs-mock-area">IRS1 резерв</span>
                  <h3 className="fs-mock-title">Мои задачи</h3>
                </div>

                {/* Filter Tabs */}
                <div className="fs-mock-filters">
                  {MOCK_FILTERS.map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      className={`fs-mock-filter ${f.id === activeFilter ? 'fs-mock-filter--active' : ''}`}
                      onClick={() => setActiveFilter(f.id)}
                    >
                      <span>{f.label}</span>
                      <span className="fs-mock-filter-count">
                        {MOCK_TASKS.filter(FILTER_MATCHERS[f.id]).length}
                      </span>
                      {f.id === 'active' && <CalloutMarker num={1} />}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="fs-mock-table-wrap">
                  <table className="fs-mock-table">
                    <thead>
                      <tr>
                        <th>
                          Ключ
                          <CalloutMarker num={2} />
                        </th>
                        <th>Название</th>
                        <th>Спринт</th>
                        <th>
                          Приоритет
                          <CalloutMarker num={3} />
                        </th>
                        <th>Статус</th>
                        <th>Исполнитель</th>
                        <th>Наблюдение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTasks.map((task) => (
                        <tr key={task.key} className="fs-mock-row motion-border">
                          <td>
                            <MonoBadge variant="ghost">{task.key}</MonoBadge>
                          </td>
                          <td className="fs-mock-cell-title">{task.title}</td>
                          <td className="fs-mock-cell-dim">{task.sprint}</td>
                          <td>
                            <span className="fs-mock-priority" style={{ color: PRIORITY_MAP[task.priority].color }}>
                              <SigilDiamond size={8} color={PRIORITY_MAP[task.priority].color} />
                              {PRIORITY_MAP[task.priority].label}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={STATUS_MAP[task.status]} label={STATUS_LABELS[task.status]} />
                          </td>
                          <td className="fs-mock-cell-dim">{task.assignee}</td>
                          <td className="fs-mock-cell-dim">{task.watcher}</td>
                        </tr>
                      ))}
                      {visibleTasks.length === 0 && (
                        <tr>
                          <td colSpan={7} className="fs-mock-empty">
                            В этом срезе пока нет задач. Переключись на «Отслеживаемые» или создай новую задачу.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="fs-mock-footer">
                  <span className="fs-mock-footer-count">В срезе: {visibleTasks.length}</span>
                  <DividerDashedTerminal />
                </div>

                <CardGlyphWatermark glyph="crosshair" size={180} />
              </div>
            </PanelCorners>
          </div>

          {/* ── ANNOTATIONS ── */}
          <div data-reveal className="fs-annotations motion-reveal">
            <div className="fs-annotations-header">
              <SigilCrosshair size={20} color="var(--color-accent)" />
              <span className="fs-annotations-label">На что смотреть</span>
            </div>
            <div className="fs-annotations-grid">
              {ANNOTATIONS.map((a, i) => (
                <div
                  key={a.num}
                  className="fs-annotation motion-border"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="fs-annotation-num">{String(a.num).padStart(2, '0')}</div>
                  <div className="fs-annotation-body">
                    <h4 className="fs-annotation-title">{a.title}</h4>
                    <p className="fs-annotation-desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}


const CSS = `
  .fs {
    position: relative;
    padding-top: 2rem;
  }

  .fs-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2rem;
  }

  .fs-divider {
    margin-bottom: 3rem;
    max-width: 600px;
  }

  /* ── MOCK WRAPPER ── */

  .fs-mock-wrap {
    margin-bottom: 3rem;
  }

  .fs-mock {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  /* ── MOCK NAV ── */

  .fs-mock-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .fs-mock-nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fs-mock-project {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .fs-mock-nav-tabs {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .fs-mock-nav-tab {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    cursor: default;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color var(--transition-fast);
  }

  .fs-mock-nav-tab--active {
    color: var(--color-text);
  }

  .fs-mock-nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fs-mock-create-btn {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--color-accent);
    color: var(--color-accent-text);
    border: 1px solid var(--color-accent);
    padding: 0.5rem 1rem;
    cursor: default;
    transition: background var(--transition-fast);
  }

  /* ── MOCK TITLE ── */

  .fs-mock-title-row {
    padding: 1.25rem 1.5rem 0.75rem;
  }

  .fs-mock-area {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.25rem;
  }

  .fs-mock-title {
    font-family: var(--font-body);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }

  /* ── MOCK FILTERS ── */

  .fs-mock-filters {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .fs-mock-filter {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-tertiary);
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
    transition: color var(--transition-fast);
    white-space: nowrap;
  }

  .fs-mock-filter-count {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-tertiary);
    border: 1px solid var(--color-border);
    padding: 1px 6px;
    min-width: 20px;
    text-align: center;
  }

  .fs-mock-filter:hover {
    color: var(--color-text-secondary);
  }

  .fs-mock-filter--active {
    color: var(--color-accent);
  }

  .fs-mock-filter--active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
    box-shadow: var(--glow-accent);
  }

  /* ── MOCK TABLE ── */

  .fs-mock-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .fs-mock-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 860px;
  }

  .fs-mock-table th {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    text-align: left;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    white-space: nowrap;
    position: relative;
  }

  .fs-mock-table td {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border-subtle);
    vertical-align: middle;
  }

  .fs-mock-row {
    transition: background var(--transition-fast);
    cursor: default;
  }

  .fs-mock-row:hover {
    background: var(--color-surface-hover);
  }

  .fs-mock-empty {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-tertiary);
    text-align: center;
    padding: 1.25rem 1rem;
  }

  .fs-mock-cell-title {
    color: var(--color-text);
    font-weight: 500;
  }

  .fs-mock-cell-dim {
    color: var(--color-text-tertiary);
    font-size: 0.8rem;
  }

  .fs-mock-priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* ── MOCK FOOTER ── */

  .fs-mock-footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  .fs-mock-footer-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  /* ── CALLOUT MARKERS ── */

  .fs-callout-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--color-accent);
    color: var(--color-bg);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 700;
    flex-shrink: 0;
    vertical-align: middle;
    margin-left: 6px;
    position: relative;
    z-index: 2;
    box-shadow: var(--glow-accent);
  }

  /* ── ANNOTATIONS ── */

  .fs-annotations {
    margin-top: 3rem;
  }

  .fs-annotations-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
  }

  .fs-annotations-label {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .fs-annotations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .fs-annotation {
    background: var(--color-surface);
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    transition: background var(--transition-fast), border-color var(--transition-base);
    opacity: 0;
    transform: translateY(12px);
  }

  .motion-visible .fs-annotation {
    animation: fs-annotation-in 500ms ease-out forwards;
  }

  @keyframes fs-annotation-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .fs-annotation {
      opacity: 1;
      transform: none;
    }
    .motion-visible .fs-annotation {
      animation: none;
    }
  }

  .fs-annotation:hover {
    background: var(--color-surface-hover);
  }

  .fs-annotation-num {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
    min-width: 2rem;
    text-shadow: var(--glow-accent);
  }

  .fs-annotation-title {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 0.5rem;
  }

  .fs-annotation-desc {
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .fs-annotations-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .fs-intro {
      font-size: 1rem;
      line-height: 1.65;
    }

    .fs-mock-table {
      min-width: 720px;
    }
  }

  @media (max-width: 640px) {
    .fs-mock-nav {
      padding: 0.75rem 1rem;
      gap: 0.65rem;
    }
    .fs-mock-nav-tabs {
      gap: 0.55rem;
      flex-wrap: nowrap;
      overflow-x: auto;
      width: 100%;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .fs-mock-nav-tabs::-webkit-scrollbar { display: none; }
    .fs-mock-nav-tab {
      white-space: nowrap;
      font-size: 0.68rem;
    }
    .fs-mock-project {
      font-size: 0.68rem;
      letter-spacing: 0.08em;
    }
    .fs-mock-create-btn {
      font-size: 0.66rem;
      padding: 0.45rem 0.7rem;
    }
    .fs-mock-title-row {
      padding: 1rem;
    }
    .fs-mock-filters {
      padding: 0 1rem;
      overflow-x: auto;
      flex-wrap: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .fs-mock-filters::-webkit-scrollbar { display: none; }
    .fs-mock-filter {
      font-size: 0.76rem;
      padding: 0.68rem 0.75rem;
      gap: 6px;
    }
    .fs-mock-filter-count {
      font-size: 0.66rem;
      padding: 1px 5px;
      min-width: 18px;
    }
    .fs-mock-table {
      min-width: 0;
      table-layout: fixed;
    }
    .fs-mock-table th,
    .fs-mock-table td {
      padding: 0.62rem 0.52rem;
      font-size: 0.74rem;
    }
    .fs-mock-table th:nth-child(3),
    .fs-mock-table td:nth-child(3),
    .fs-mock-table th:nth-child(7),
    .fs-mock-table td:nth-child(7) {
      display: none;
    }
    .fs-mock-cell-title {
      line-height: 1.35;
      font-size: 0.78rem;
    }
    .fs-mock-cell-dim {
      font-size: 0.72rem;
    }
    .fs-mock-priority {
      font-size: 0.68rem;
      gap: 4px;
    }
    .fs-mock-footer {
      padding: 0.62rem 1rem;
      gap: 0.65rem;
      flex-wrap: wrap;
    }
    .fs-annotation {
      padding: 1.25rem;
    }
    .fs-annotation-desc {
      font-size: 0.82rem;
      line-height: 1.55;
    }
  }

  @media (max-width: 420px) {
    .fs-mock-table th:nth-child(6),
    .fs-mock-table td:nth-child(6) {
      display: none;
    }
  }
`;
