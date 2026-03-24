import { useState } from 'react';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode, SigilScan,
  DividerNodeLine, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge, StatusBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';
import GuideVideo from '../media/GuideVideo';


const TABS = [
  { id: 'tasks',     label: 'Мои задачи' },
  { id: 'backlog',   label: 'Бэклог' },
  { id: 'kanban',    label: 'Канбан' },
  { id: 'structure', label: 'Структура задач' },
  { id: 'time',      label: 'Учёт времени' },
  { id: 'filters',   label: 'Фильтры' },
];

const TAB_DESCRIPTIONS = {
  tasks:     'Личный экран на каждый день: что делаю сейчас, что горит, что блокирует. Не управляй отсюда всем проектом.',
  backlog:   'Очередь работы перед спринтом. Здесь выбирают, что брать дальше. Не превращай бэклог в склад вечных задач.',
  kanban:    'Канбан показывает реальное движение карточек по статусам. Если статус не обновляется, доска перестаёт быть правдой.',
  structure: 'Иерархия проекта: эпик -> задача -> подзадача. Нужна, когда проект уже не помещается в один плоский список.',
  time:      'План vs факт по трудозатратам. Это про честную оценку объема, а не про поиск виноватых.',
  filters:   'Точечный поиск по QL. Спасает, когда задач много и руками листать уже бессмысленно.',
};

const TAB_META = {
  tasks: ['ежедневный вход', 'личный список', 'обновляй статус каждый день'],
  backlog: ['очередь перед спринтом', 'планируй осознанно', 'не складывай мусор'],
  kanban: ['канбан доска', '3 колонки', '7 карточек в текущем срезе'],
  structure: ['каркас проекта', '9 узлов', 'финальный узел: ROB-012'],
  time: ['план vs факт', '4 задачи', 'контроль перерасхода'],
  filters: ['точечная выборка', 'ql-запрос активен', '2 задачи в срезе'],
};

const SCREEN_GUIDES = {
  tasks: {
    title: 'Как использовать экран «Мои задачи»',
    steps: [
      'Открывай его утром первым делом.',
      'Смотри вкладку с активными задачами.',
      'Проверяй дедлайны и статусы.',
      'Если задача уже делается - статус должен это показывать.',
      'Если карточка пустая, не жди чуда - допиши её.',
    ],
  },
  backlog: {
    title: 'Как работать с бэклогом',
    steps: [
      'Скидывай туда новые задачи, которые ещё не идут в работу.',
      'Чисти мусорные и мутные карточки.',
      'Перед спринтом пересмотри приоритеты.',
      'Не превращай бэклог в кладбище идей.',
      'В спринт переносится не всё подряд, а только то, что реально можно закрыть.',
    ],
  },
  kanban: {
    title: 'Как читать канбан-доску',
    steps: [
      'Слева - ещё не начато.',
      'В центре - реально делается.',
      'Справа - реально закончено.',
      'Если карточка неделями стоит в одной колонке - у вас проблема.',
      'Если статус не меняется, доска врёт.',
    ],
  },
  structure: {
    title: 'Как понять, нужна ли вам структура задач',
    steps: [
      'Если проект маленький - скорее всего, не нужна.',
      'Если есть эпики, большие блоки и подзадачи - уже нужна.',
      'Если команда теряет общую картину - точно нужна.',
      'Структура показывает скелет проекта, а не текущий поток.',
      'Не строй 7 уровней, если вам и 3 пока тяжело читать.',
    ],
  },
  time: {
    title: 'Как списывать время без боли',
    steps: [
      'Работал над задачей - зафиксируй это в тот же день.',
      'Не копи всё на вечер воскресенья.',
      'Смотри, где факт начинает съедать оценку.',
      'Если задача жрёт больше времени, чем планировали, это сигнал, а не позор.',
      'Учёт времени нужен, чтобы перестать гадать про сроки.',
    ],
  },
  filters: {
    title: 'Как не утонуть в списке задач',
    steps: [
      'Сначала фильтруй по себе.',
      'Потом по спринту.',
      'Потом по просрочке или статусу.',
      'Не смотри на весь проект разом, если тебе нужен конкретный срез.',
      'Если задач много, фильтр - это не роскошь, а способ выжить.',
    ],
  },
};

const SCREEN_EXTRA_GUIDES = {
  kanban: [
    {
      title: 'Как создать доску в Сфере',
      steps: [
        'Перейди в раздел «Канбан» и нажми «Создать доску».',
        'Укажи название доски и выбери пространство.',
        'По умолчанию задай базовые колонки: Открыта, В работе, Проверка, Готово.',
        'Чтобы добавить новую колонку, нажми + справа от существующих колонок.',
        'В окне настройки укажи название колонки и привяжи к ней нужные статусы.',
        'Помни: статус, который не привязан ни к одной колонке, на доске не появится.',
        'После создания доски проверь, что карточки реально попадают в нужные колонки.',
        'Под каждый новый спринт лучше заводить отдельную доску: так чище видно поток и меньше путаницы по статусам.',
        'Если доска не совпадает с реальной логикой команды, лучше переделать её сразу, чем потом жить в кривом workflow.',
      ],
    },
  ],
  structure: [
    {
      title: 'Как создать первую структуру задач',
      steps: [
        'Перейди в раздел «Структура задач».',
        'Нажми создание новой структуры.',
        'Укажи название и пространство.',
        'Выбери, кто будет видеть структуру.',
        'Настрой уровни: обычно хватает Эпик -> Задача -> Подзадача.',
        'Сохрани структуру.',
      ],
    },
  ],
  time: [
    {
      title: 'Как понять, что задачи оцениваются плохо',
      steps: [
        'Открой учёт времени.',
        'Сравни оценку и факт.',
        'Найди карточки, где факт стабильно выше оценки.',
        'Посмотри, что у этих задач общего.',
        'Не обвиняй людей - улучшай декомпозицию и планирование.',
      ],
    },
  ],
};

const PRIORITY_MAP = {
  high:   { label: 'Высокий', color: 'var(--color-error)' },
  medium: { label: 'Средний', color: 'var(--color-warning)' },
  low:    { label: 'Низкий',  color: 'var(--color-text-tertiary)' },
};

const TASKS_DATA = [
  { key: 'ROB-012', title: 'Калибровка IMU + LiDAR',           sprint: 'Спринт 2', priority: 'high',   status: 'active',  estimate: '6ч', fact: '4ч', assignee: 'Петрова М.' },
  { key: 'ROB-013', title: 'PID-регулятор скорости',            sprint: 'Спринт 2', priority: 'high',   status: 'active',  estimate: '8ч', fact: '3ч', assignee: 'Сидоров К.' },
  { key: 'ROB-014', title: 'Unit-тесты навигации',              sprint: 'Спринт 2', priority: 'medium', status: 'warning', estimate: '4ч', fact: '0ч', assignee: 'Иванов А.' },
  { key: 'ROB-015', title: 'Документация REST API',             sprint: 'Спринт 3', priority: 'low',    status: 'idle',    estimate: '4ч', fact: '0ч', assignee: '—' },
  { key: 'ROB-016', title: 'Интеграция камеры с ROS2',          sprint: 'Спринт 2', priority: 'high',   status: 'done',    estimate: '6ч', fact: '7ч', assignee: 'Козлов Д.' },
];

const STATUS_MAP = { active: 'active', warning: 'warning', idle: 'idle', done: 'done', error: 'error' };
const STATUS_LABELS = { active: 'В работе', warning: 'Открыта', idle: 'Бэклог', done: 'Готово', error: 'Просрочена' };

const BACKLOG_SPRINTS = [
  { sprint: 'Спринт 2 (текущий)', tasks: 8, done: 3, status: 'active' },
  { sprint: 'Спринт 3',          tasks: 5, done: 0, status: 'idle' },
];

const BACKLOG_ITEMS = [
  { key: 'ROB-020', title: 'Настройка SLAM для коридоров',     priority: 'high',   type: 'Задача' },
  { key: 'ROB-021', title: 'Тест на полигоне v2',             priority: 'medium', type: 'Подзадача' },
  { key: 'ROB-022', title: 'Оптимизация pointcloud pipeline', priority: 'medium', type: 'Задача' },
  { key: 'ROB-023', title: 'Рефактор конфига launch-файлов',  priority: 'low',    type: 'Подзадача' },
];

const KANBAN_COLS = [
  { title: 'ОТКРЫТА', count: 3, cards: [
    { key: 'ROB-030', title: 'Документация URDF модели', assignee: '—' },
    { key: 'ROB-031', title: 'Настройка CI/CD pipeline', assignee: '—' },
    { key: 'ROB-032', title: 'Замер энергопотребления',   assignee: '—' },
  ]},
  { title: 'В РАБОТЕ', count: 2, cards: [
    { key: 'ROB-033', title: 'Obstacle avoidance LiDAR',  assignee: 'Петрова М.' },
    { key: 'ROB-034', title: 'Телеметрия по WebSocket',   assignee: 'Сидоров К.' },
  ]},
  { title: 'РЕШЕНА', count: 2, cards: [
    { key: 'ROB-036', title: 'Сборка шасси v2',          assignee: 'Козлов Д.' },
    { key: 'ROB-037', title: 'Калибровка камеры',        assignee: 'Петрова М.' },
  ]},
];

const STRUCTURE_TREE = [
  { level: 0, type: 'epic',    key: 'ROB-E01', title: 'Навигация мобильного робота' },
  { level: 1, type: 'task',    key: 'ROB-010', title: 'Obstacle avoidance на базе LiDAR' },
  { level: 2, type: 'subtask', key: 'ROB-010-1', title: 'Настройка pointcloud pipeline' },
  { level: 2, type: 'subtask', key: 'ROB-010-2', title: 'Алгоритм обхода препятствий' },
  { level: 2, type: 'subtask', key: 'ROB-010-3', title: 'Тест на 3 сценариях полигона' },
  { level: 1, type: 'task',    key: 'ROB-011', title: 'SLAM для indoor-навигации' },
  { level: 2, type: 'subtask', key: 'ROB-011-1', title: 'Интеграция cartographer' },
  { level: 2, type: 'subtask', key: 'ROB-011-2', title: 'Калибровка в 3 зонах' },
  { level: 1, type: 'task',    key: 'ROB-012', title: 'Интеграция навигационного стека ROS2' },
];

const KANBAN_VIDEO = '/media/sfera/kanban.webm';

const TIME_DATA = [
  { key: 'ROB-010', title: 'Obstacle avoidance LiDAR', status: 'active',  progress: 65, effort: 72, estimate: '16ч', fact: '11.5ч', deadline: '28.04', assignee: 'Петрова М.' },
  { key: 'ROB-011', title: 'SLAM indoor-навигация',     status: 'active',  progress: 40, effort: 55, estimate: '20ч', fact: '11ч',   deadline: '05.05', assignee: 'Сидоров К.' },
  { key: 'ROB-012', title: 'Навиг. стек ROS2',          status: 'warning', progress: 10, effort: 15, estimate: '12ч', fact: '1.8ч',  deadline: '28.04', assignee: 'Иванов А.' },
  { key: 'ROB-013', title: 'Документация API',           status: 'idle',    progress: 0,  effort: 0,  estimate: '6ч',  fact: '0ч',    deadline: '12.05', assignee: '—' },
];


function TabTasks() {
  return (
    <div className="sc-tab-content">
      <div className="sc-mock-table-wrap">
        <table className="sc-mock-table sc-mock-table--tasks">
          <thead>
            <tr>
              <th>Ключ</th>
              <th>Название</th>
              <th>Спринт</th>
              <th>Приоритет</th>
              <th>Статус</th>
              <th>Оценка</th>
              <th>Факт</th>
              <th>Исполнитель</th>
            </tr>
          </thead>
          <tbody>
            {TASKS_DATA.map((t) => (
              <tr key={t.key} className="sc-mock-row motion-border">
                <td><MonoBadge variant="ghost">{t.key}</MonoBadge></td>
                <td className="sc-cell-title">{t.title}</td>
                <td className="sc-cell-dim">{t.sprint}</td>
                <td>
                  <span className="sc-priority" style={{ color: PRIORITY_MAP[t.priority].color }}>
                    <SigilDiamond size={8} color={PRIORITY_MAP[t.priority].color} />
                    {PRIORITY_MAP[t.priority].label}
                  </span>
                </td>
                <td><StatusBadge status={STATUS_MAP[t.status]} label={STATUS_LABELS[t.status]} /></td>
                <td className="sc-cell-dim">{t.estimate}</td>
                <td className="sc-cell-dim">{t.fact}</td>
                <td className="sc-cell-dim">{t.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function TabBacklog() {
  return (
    <div className="sc-tab-content">
      <div className="sc-backlog-section">
        <div className="sc-backlog-label">
          <SigilHexNode size={16} color="var(--color-accent)" />
          <span>Спринты</span>
        </div>
        <div className="sc-backlog-sprints">
          {BACKLOG_SPRINTS.map((s) => (
            <div key={s.sprint} className="sc-backlog-sprint motion-border">
              <StatusDot status={s.status} size={6} />
              <span className="sc-backlog-sprint-name">{s.sprint}</span>
              <span className="sc-backlog-sprint-count">{s.done}/{s.tasks} задач</span>
            </div>
          ))}
        </div>
      </div>
      <DividerDashedTerminal />
      <div className="sc-backlog-section">
        <div className="sc-backlog-label">
          <SigilScan size={16} color="var(--color-text-tertiary)" />
          <span>Бэклог</span>
        </div>
        <div className="sc-backlog-items">
          {BACKLOG_ITEMS.map((item) => (
            <div key={item.key} className="sc-backlog-item motion-border">
              <MonoBadge variant="ghost">{item.key}</MonoBadge>
              <span className="sc-backlog-item-title">{item.title}</span>
              <span className="sc-backlog-item-type">{item.type}</span>
              <span className="sc-priority" style={{ color: PRIORITY_MAP[item.priority].color }}>
                {PRIORITY_MAP[item.priority].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TabKanban() {
  const [activeCardKey, setActiveCardKey] = useState('ROB-032');

  return (
    <div className="sc-tab-content sc-kanban-wrap">
      <div className="sc-kanban-board-shell">
        <div className="sc-kanban">
          {KANBAN_COLS.map((col) => (
            <div key={col.title} className="sc-kanban-col">
              <div className="sc-kanban-col-head">
                <span className="sc-kanban-col-title">{col.title}</span>
                <MonoBadge variant="default">{col.count}</MonoBadge>
              </div>
              <div className="sc-kanban-col-cards">
                {col.cards.map((card) => {
                  const isActive = card.key === activeCardKey;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      className={`sc-kanban-card motion-border ${isActive ? 'sc-kanban-card--active' : ''}`}
                      onClick={() => setActiveCardKey(card.key)}
                      aria-pressed={isActive}
                    >
                      <MonoBadge variant="ghost">{card.key}</MonoBadge>
                      <span className="sc-kanban-card-title">{card.title}</span>
                      <span className="sc-kanban-card-assignee">{card.assignee}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TabStructure() {
  const typeColors = {
    epic:    'var(--color-accent-gold)',
    task:    'var(--color-accent)',
    subtask: 'var(--color-text-tertiary)',
  };
  const typeLabels = { epic: 'Эпик', task: 'Задача', subtask: 'Подзадача' };
  const [activeNodeKey, setActiveNodeKey] = useState('ROB-012');

  return (
    <div className="sc-tab-content">
      <div className="sc-structure-toolbar">
        <div className="sc-structure-select">Выберите владельца</div>
        <div className="sc-structure-toolbar-right">
          <button type="button" className="sc-structure-btn">Новая структура</button>
        </div>
      </div>
      <div className="sc-tree-shell">
        <div className="sc-tree">
          {STRUCTURE_TREE.map((node) => {
            const isActive = node.key === activeNodeKey;
            return (
              <button
                type="button"
                key={node.key}
                className={`sc-tree-node ${isActive ? 'sc-tree-node--active' : ''}`}
                style={{ paddingLeft: `${node.level * 18 + 6}px` }}
                onClick={() => setActiveNodeKey(node.key)}
                aria-pressed={isActive}
              >
                {node.level > 0 && (
                  <span className="sc-tree-line" style={{ left: `${node.level * 18 - 4}px` }} />
                )}
                <SigilDiamond size={node.level === 0 ? 10 : 7} color={typeColors[node.type]} />
                <MonoBadge variant={node.type === 'epic' ? 'gold' : 'ghost'}>{node.key}</MonoBadge>
                <span className="sc-tree-title" style={{ color: node.type === 'epic' ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
                  {node.title}
                </span>
                <span className="sc-tree-type" style={{ color: typeColors[node.type] }}>
                  {typeLabels[node.type]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}


function TabTime() {
  return (
    <div className="sc-tab-content">
      <div className="sc-mock-table-wrap">
        <table className="sc-mock-table sc-mock-table--time">
          <thead>
            <tr>
              <th>Ключ</th>
              <th>Название</th>
              <th>Статус</th>
              <th>Прогресс</th>
              <th>% трудозатрат</th>
              <th>Оценка</th>
              <th>Факт</th>
              <th>Срок</th>
              <th>Исполнитель</th>
            </tr>
          </thead>
          <tbody>
            {TIME_DATA.map((t) => (
              <tr key={t.key} className="sc-mock-row motion-border">
                <td><MonoBadge variant="ghost">{t.key}</MonoBadge></td>
                <td className="sc-cell-title">{t.title}</td>
                <td><StatusBadge status={STATUS_MAP[t.status]} label={STATUS_LABELS[t.status]} /></td>
                <td>
                  <div className="sc-progress">
                    <div className="sc-progress-bar">
                      <div className="sc-progress-fill" style={{ width: `${t.progress}%` }} />
                    </div>
                    <span className="sc-progress-num">{t.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`sc-effort ${t.effort > 80 ? 'sc-effort--over' : ''}`}>
                    {t.effort}%
                  </span>
                </td>
                <td className="sc-cell-dim">{t.estimate}</td>
                <td className="sc-cell-dim">{t.fact}</td>
                <td className="sc-cell-dim">{t.deadline}</td>
                <td className="sc-cell-dim">{t.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function TabFilters() {
  return (
    <div className="sc-tab-content">
      <div className="sc-filter-ql">
        <span className="sc-filter-ql-label">QL</span>
        <div className="sc-filter-ql-input">
          Исполнитель = &quot;Петрова М.&quot; AND Статус != &quot;Готово&quot; AND Спринт = &quot;Спринт 2&quot;
        </div>
      </div>
      <div className="sc-filter-results">
        <div className="sc-filter-results-header">
          <SigilScan size={14} color="var(--color-accent)" />
          <span>Результат: 2 задачи</span>
        </div>
        {[
          { key: 'ROB-012', title: 'Калибровка IMU + LiDAR', status: 'active' },
          { key: 'ROB-033', title: 'Obstacle avoidance LiDAR', status: 'active' },
        ].map((t) => (
          <div key={t.key} className="sc-filter-row motion-border">
            <MonoBadge variant="ghost">{t.key}</MonoBadge>
            <span className="sc-cell-title">{t.title}</span>
            <StatusBadge status={STATUS_MAP[t.status]} label={STATUS_LABELS[t.status]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenGuidePanel({ tabId }) {
  const guide = SCREEN_GUIDES[tabId];
  if (!guide) return null;
  const guides = [guide, ...(SCREEN_EXTRA_GUIDES[tabId] ?? [])];

  return (
    <div data-reveal className="sc-guide-wrap sc-guide-dynamic motion-panel">
      <div className="sc-guide-stack">
        {guides.map((item) => (
          <PanelCorners key={item.title} size={14} color="var(--color-border-strong)">
            <div className="sc-guide">
              <CardTopAccent color="var(--color-accent)" width={48} />
              <div className="sc-guide-head">
                <MonoBadge variant="accent">гайд</MonoBadge>
                <h3 className="sc-guide-title">{item.title}</h3>
              </div>
              <ul className="sc-guide-list">
                {item.steps.map((text, i) => (
                  <li key={text} className="sc-guide-step">
                    <span className="sc-guide-num">{String(i + 1).padStart(2, '0')}</span>
                    <SigilDiamond size={8} color="var(--color-accent)" />
                    <span className="sc-guide-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PanelCorners>
        ))}
      </div>
    </div>
  );
}


const TAB_COMPONENTS = {
  tasks:     TabTasks,
  backlog:   TabBacklog,
  kanban:    TabKanban,
  structure: TabStructure,
  time:      TabTime,
  filters:   TabFilters,
};


export default function ScreensSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });
  const [activeTab, setActiveTab] = useState('tasks');
  const ActivePanel = TAB_COMPONENTS[activeTab];

  return (
    <>
      <style>{CSS}</style>
      <section id="screens" ref={containerRef} className="sc">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="04" />
            <h2 className="ds-section-title">Экраны, которые тебе нужны</h2>
          </div>

          <p className="sc-intro">
            Это карта выживания по интерфейсу Сферы.
            Тебе не нужно помнить все вкладки - важно понимать,
            в какой экран идти за конкретным ответом и что там делать.
          </p>

          <div className="ds-ascii-strip">
            <AsciiCharm variant="runner" size="md" tone="soft" seed="screens-runner" />
            <AsciiCharm variant="spark" size="xs" tone="accent" seed="screens-spark" />
          </div>

          <div data-reveal className="sc-screen-wrap motion-panel">
            <PanelCorners size={16} color="var(--color-border-strong)">
              <div className="sc-screen">
                <CardTopAccent color="var(--color-accent)" width={56} />

                <div className="sc-screen-nav">
                  <div className="sc-screen-nav-left">
                    <StatusDot status="active" size={6} />
                    <span className="sc-screen-project">IRS1 · проект</span>
                  </div>
                  <div className="sc-screen-tabs">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`sc-screen-tab ${activeTab === tab.id ? 'sc-screen-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {activeTab === tab.id && <BracketOrnament text=">>" color="var(--color-accent)" />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sc-screen-desc">
                  <SigilDiamond size={8} color="var(--color-accent)" />
                  <span>{TAB_DESCRIPTIONS[activeTab]}</span>
                </div>

                <div className="sc-screen-meta">
                  {TAB_META[activeTab].map((item) => (
                    <span key={item} className="sc-screen-meta-chip">
                      <SigilDiamond size={7} color="var(--color-text-tertiary)" />
                      {item}
                    </span>
                  ))}
                </div>

                <ActivePanel />

                <div className="sc-screen-footer">
                  <DividerDashedTerminal />
                </div>

                <CardGlyphWatermark glyph="hexnode" size={180} />
              </div>
            </PanelCorners>
          </div>

          {activeTab === 'kanban' && (
            <GuideVideo
              className="sc-kanban-video-block"
              src={KANBAN_VIDEO}
              badge="kanban / webm"
              title="Канбан-доска вживую"
              caption="Проверяй главное: карточка двигается между колонками, а статус меняется вместе с ней."
            />
          )}

          <ScreenGuidePanel tabId={activeTab} />

          <div style={{ marginTop: '2rem', maxWidth: 500 }}>
            <DividerNodeLine />
          </div>

        </div>
      </section>
    </>
  );
}


const CSS = `
  .sc {
    position: relative;
    padding-top: 2rem;
  }

  .sc-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  .sc-screen-wrap { margin-bottom: 2rem; }

  .sc-screen {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .sc-screen-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    flex-wrap: wrap;
  }

  .sc-screen-nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .sc-screen-project {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .sc-screen-tabs {
    display: flex;
    gap: 0;
    flex-wrap: wrap;
  }

  .sc-screen-tab {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    background: none;
    border: none;
    padding: 0.5rem 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color var(--transition-fast);
    white-space: nowrap;
  }

  .sc-screen-tab:hover { color: var(--color-text-secondary); }

  .sc-screen-tab--active {
    color: var(--color-text);
    background: var(--color-surface);
  }

  .sc-screen-desc {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .sc-screen-desc > svg { flex-shrink: 0; margin-top: 3px; }

  .sc-screen-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.7rem 1.5rem 1rem;
    border-bottom: 1px solid var(--color-border-subtle);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-bg-raised) 75%, transparent),
      transparent
    );
  }

  .sc-screen-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.63rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    padding: 0.34rem 0.5rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
  }

  .sc-screen-meta-chip > svg {
    flex-shrink: 0;
    opacity: 0.8;
  }

  .sc-screen-footer { padding: 0.75rem 1.5rem; }

  /* ── TABLE ── */

  .sc-mock-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .sc-mock-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
  }

  .sc-mock-table th {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    text-align: left;
    padding: 0.7rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    white-space: nowrap;
  }

  .sc-mock-table td {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    padding: 0.65rem 0.875rem;
    border-bottom: 1px solid var(--color-border-subtle);
    vertical-align: middle;
  }

  .sc-mock-row {
    transition: background var(--transition-fast);
    cursor: default;
  }

  .sc-mock-row:hover { background: var(--color-surface-hover); }

  .sc-cell-title { color: var(--color-text); font-weight: 500; }
  .sc-cell-dim { color: var(--color-text-tertiary); font-size: 0.78rem; }

  .sc-priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* ── PROGRESS BAR ── */

  .sc-progress {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sc-progress-bar {
    width: 60px;
    height: 4px;
    background: var(--color-border);
    position: relative;
    overflow: hidden;
  }

  .sc-progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--color-accent);
  }

  .sc-progress-num {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
  }

  .sc-effort {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .sc-effort--over { color: var(--color-error); font-weight: 600; }

  /* ── BACKLOG ── */

  .sc-backlog-section { margin: 1rem 0; padding: 0 1.5rem; }

  .sc-backlog-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 0.75rem;
  }

  .sc-backlog-sprints {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sc-backlog-sprint {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    transition: border-color var(--transition-fast);
  }

  .sc-backlog-sprint:hover { border-color: var(--color-border-strong); }

  .sc-backlog-sprint-name {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text);
    font-weight: 500;
  }

  .sc-backlog-sprint-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
    margin-left: auto;
  }

  .sc-backlog-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sc-backlog-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.65rem 1rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    transition: border-color var(--transition-fast);
  }

  .sc-backlog-item:hover { border-color: var(--color-border-strong); }

  .sc-backlog-item-title {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text);
    font-weight: 500;
    flex: 1;
  }

  .sc-backlog-item-type {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-tertiary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── KANBAN ── */

  .sc-kanban-wrap { padding: 1.2rem 1.5rem 0.85rem; }

  .sc-kanban-video-block {
    margin-top: 0;
    margin-bottom: 1.2rem;
  }

  .sc-kanban-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .sc-kanban-toolbar-left,
  .sc-kanban-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .sc-kanban-select {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    min-width: 116px;
  }

  .sc-kanban-btn {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--color-accent);
    background: var(--color-accent);
    color: var(--color-text-inverse);
    cursor: pointer;
    transition:
      background var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .sc-kanban-btn--ghost {
    background: transparent;
    color: var(--color-accent);
  }

  .sc-kanban-btn--ghost.is-active {
    background: color-mix(in srgb, var(--color-accent) 14%, transparent);
    border-color: var(--color-border-strong);
  }

  .sc-kanban-board-shell {
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    padding: 0.6rem;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-border-subtle) 55%, transparent);
  }

  .sc-kanban {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
    align-items: start;
  }

  .sc-kanban-col {
    background: var(--color-bg-raised);
    padding: 0.68rem;
    align-self: start;
  }

  .sc-kanban-col-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sc-kanban-col-title {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .sc-kanban-col-cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sc-kanban-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 0.6rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition:
      border-color var(--transition-fast),
      background var(--transition-fast),
      transform var(--transition-fast);
  }

  .sc-kanban-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
  }

  .sc-kanban-card--active {
    border-color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 9%, var(--color-surface));
  }

  .sc-kanban-card-title {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text);
    font-weight: 500;
    line-height: 1.4;
  }

  .sc-kanban-card-assignee {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-tertiary);
  }

  /* ── TAB GUIDES (Канбан / Структура) ── */

  .sc-guide-wrap {
    margin-top: 1.5rem;
  }

  .sc-guide-stack {
    display: grid;
    gap: 0.9rem;
  }

  .sc-guide-dynamic {
    margin-bottom: 1.2rem;
  }

  .sc-guide-wrap--inline {
    margin-top: 0.9rem;
  }

  .sc-tab-content:not(.sc-kanban-wrap) > .sc-guide-wrap {
    padding: 0 1.5rem 1.5rem;
  }

  .sc-guide {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.5rem 1.5rem 1.75rem;
    overflow: hidden;
  }

  .sc-guide-head {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
  }

  .sc-guide-title {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text);
    margin: 0;
  }

  .sc-guide-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .sc-guide-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .sc-guide-num {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    min-width: 1.45rem;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .sc-guide-step > svg { flex-shrink: 0; margin-top: 4px; }

  .sc-guide-text {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  .sc-guide-note,
  .sc-guide-tip {
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--color-accent-gold);
    line-height: 1.55;
    margin: 1.1rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  /* ── TREE ── */

  .sc-tree-shell {
    margin: 0 1.5rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
  }

  .sc-tree {
    padding: 0.72rem 1.1rem 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sc-structure-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.5rem 0.65rem;
    flex-wrap: wrap;
  }

  .sc-structure-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .sc-structure-select {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    min-width: 220px;
  }

  .sc-structure-btn {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--color-accent);
    background: var(--color-accent);
    color: var(--color-text-inverse);
    cursor: pointer;
    transition:
      background var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .sc-structure-btn--ghost {
    background: transparent;
    color: var(--color-accent);
  }

  .sc-structure-btn--ghost.is-active {
    background: color-mix(in srgb, var(--color-accent) 14%, transparent);
    border-color: var(--color-border-strong);
  }

  .sc-tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: 0.42rem 0.75rem 0.42rem 0;
    position: relative;
    border-bottom: 1px solid var(--color-border-subtle);
    cursor: pointer;
    transition:
      background var(--transition-fast),
      border-color var(--transition-fast);
  }

  .sc-tree-node:hover {
    background: color-mix(in srgb, var(--color-accent) 5%, transparent);
  }

  .sc-tree-node--active {
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    border-bottom-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
  }

  .sc-tree-node:last-child {
    border-bottom: none;
    padding-bottom: 0.15rem;
  }

  .sc-tree-line {
    position: absolute;
    top: 0;
    width: 1px;
    height: 100%;
    background: var(--color-border);
  }

  .sc-tree-title {
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    flex: 1;
  }

  .sc-tree-type {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── FILTERS ── */

  .sc-tab-content { padding: 0; }

  .sc-filter-ql {
    display: flex;
    align-items: center;
    gap: 0;
    margin: 1rem 1.5rem;
    border: 1px solid var(--color-border);
  }

  .sc-filter-ql-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-accent);
    padding: 0.6rem 0.75rem;
    background: var(--color-bg-raised);
    border-right: 1px solid var(--color-border);
    text-transform: uppercase;
  }

  .sc-filter-ql-input {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-text);
    padding: 0.6rem 0.75rem;
    flex: 1;
    background: var(--color-surface);
  }

  .sc-filter-results {
    padding: 0 1.5rem 1rem;
  }

  .sc-filter-results-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-text-secondary);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }

  .sc-filter-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.7rem 1rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
    transition: border-color var(--transition-fast);
  }

  .sc-filter-row:hover { border-color: var(--color-border-strong); }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .sc-kanban { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sc-screen-tabs { flex-wrap: wrap; }
    .sc-tab-content:not(.sc-kanban-wrap) > .sc-guide-wrap {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .sc-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.75rem;
    }
  }

  @media (max-width: 640px) {
    .sc-screen-nav {
      padding: 0.75rem 1rem;
      gap: 0.7rem;
    }
    .sc-screen-nav-left {
      width: 100%;
    }
    .sc-screen-project {
      font-size: 0.68rem;
      letter-spacing: 0.08em;
    }
    .sc-screen-tabs {
      gap: 0.25rem;
      width: 100%;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 2px;
    }
    .sc-screen-tabs::-webkit-scrollbar { display: none; }
    .sc-screen-tab {
      padding: 0.48rem 0.68rem;
      font-size: 0.7rem;
      border: 1px solid var(--color-border);
      background: var(--color-bg-raised);
      white-space: nowrap;
    }
    .sc-screen-tab--active {
      border-color: var(--color-accent);
      background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface));
    }
    .sc-screen-desc {
      padding: 0.8rem 1rem;
      font-size: 0.84rem;
      line-height: 1.55;
    }
    .sc-screen-meta {
      padding: 0.6rem 1rem 0.85rem;
      gap: 0.4rem;
    }
    .sc-screen-meta-chip {
      font-size: 0.66rem;
      padding: 0.3rem 0.45rem;
    }
    .sc-mock-table {
      min-width: 0;
      table-layout: fixed;
    }
    .sc-mock-table th,
    .sc-mock-table td {
      padding: 0.58rem 0.5rem;
      font-size: 0.74rem;
    }
    .sc-mock-table--tasks th:nth-child(3),
    .sc-mock-table--tasks td:nth-child(3),
    .sc-mock-table--tasks th:nth-child(4),
    .sc-mock-table--tasks td:nth-child(4),
    .sc-mock-table--tasks th:nth-child(6),
    .sc-mock-table--tasks td:nth-child(6),
    .sc-mock-table--tasks th:nth-child(7),
    .sc-mock-table--tasks td:nth-child(7) {
      display: none;
    }
    .sc-mock-table--time th:nth-child(4),
    .sc-mock-table--time td:nth-child(4),
    .sc-mock-table--time th:nth-child(5),
    .sc-mock-table--time td:nth-child(5),
    .sc-mock-table--time th:nth-child(6),
    .sc-mock-table--time td:nth-child(6),
    .sc-mock-table--time th:nth-child(7),
    .sc-mock-table--time td:nth-child(7) {
      display: none;
    }
    .sc-cell-title {
      line-height: 1.35;
      font-size: 0.78rem;
    }
    .sc-cell-dim {
      font-size: 0.72rem;
    }
    .sc-kanban { grid-template-columns: 1fr; }
    .sc-kanban-wrap { padding: 1rem; }
    .sc-kanban-video-block {
      margin-bottom: 1rem;
    }
    .sc-kanban-toolbar { margin-bottom: 0.75rem; }
    .sc-kanban-toolbar-right { width: 100%; }
    .sc-kanban-btn,
    .sc-kanban-btn--ghost,
    .sc-kanban-select { width: 100%; }
    .sc-backlog-section { padding: 0.75rem 1rem; }
    .sc-structure-toolbar { padding: 0.75rem 1rem 0; gap: 0.65rem; }
    .sc-structure-select,
    .sc-structure-btn { width: 100%; }
    .sc-tree-shell {
      margin: 0 1rem;
    }
    .sc-tree {
      padding: 0.62rem 0.75rem 0.2rem;
    }
    .sc-tree-title {
      font-size: 0.76rem;
      line-height: 1.35;
    }
    .sc-tree-type {
      font-size: 0.62rem;
      letter-spacing: 0.05em;
    }
    .sc-filter-ql { margin: 0.75rem 1rem; }
    .sc-filter-results { padding: 0 1rem 0.75rem; }
    .sc-filter-ql-input {
      font-size: 0.74rem;
      line-height: 1.45;
      white-space: normal;
      word-break: break-word;
    }
    .sc-filter-row {
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 8px;
    }
    .sc-tab-content:not(.sc-kanban-wrap) > .sc-guide-wrap {
      padding: 0 1rem 1rem;
      margin-top: 1.25rem;
    }
    .sc-guide { padding: 1.15rem 1.1rem 1.35rem; }
    .sc-guide-title { font-size: 0.84rem; }
    .sc-guide-text { font-size: 0.84rem; }
  }

  @media (max-width: 420px) {
    .sc-mock-table--time th:nth-child(9),
    .sc-mock-table--time td:nth-child(9),
    .sc-tree-type {
      display: none;
    }
  }
`;
