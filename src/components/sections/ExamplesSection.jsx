import { useState } from 'react';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond,
  DividerNodeLine, DividerCircuitTrace, DividerDashedTerminal,
  PanelCorners,
  BracketOrnament,
  MonoBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
} from '../glyphs';


const TABS = [
  { id: 'ros',      label: 'Робототехника / ROS2' },
  { id: 'cv',       label: 'CV / Detector' },
  { id: 'ai',       label: 'AI-продукт' },
  { id: 'platform', label: 'Платформа / Backend' },
];

const PROJECTS = {
  ros: {
    epic: {
      key: 'ROBOCAR-E01',
      title: 'Базовая навигация мобильного робота',
      desc: 'Робот едет из точки А в точку Б, объезжая препятствия. LiDAR + ROS2 Nav2.',
    },
    tasks: [
      {
        key: 'ROBOCAR-010',
        title: 'Obstacle avoidance на базе LiDAR',
        subtasks: [
          { key: 'ROBOCAR-010-1', title: 'Настроить pointcloud pipeline (Velodyne VLP-16)' },
          { key: 'ROBOCAR-010-2', title: 'Реализовать алгоритм обхода (DWA planner)' },
          { key: 'ROBOCAR-010-3', title: 'Тест на 3 сценариях полигона' },
        ],
      },
      {
        key: 'ROBOCAR-011',
        title: 'SLAM для indoor-навигации',
        subtasks: [
          { key: 'ROBOCAR-011-1', title: 'Интеграция cartographer с Nav2' },
          { key: 'ROBOCAR-011-2', title: 'Калибровка в 3 зонах (коридор, зал, лестница)' },
          { key: 'ROBOCAR-011-3', title: 'Добиться drift < 5cm на 10м' },
        ],
      },
      {
        key: 'ROBOCAR-012',
        title: 'Интеграция навигационного стека',
        subtasks: [
          { key: 'ROBOCAR-012-1', title: 'Настройка launch-файлов Nav2' },
          { key: 'ROBOCAR-012-2', title: 'Связка с PID-регулятором скорости' },
        ],
      },
    ],
  },
  cv: {
    epic: {
      key: 'GO2VLM-E01',
      title: 'Подготовить и улучшить детектор',
      desc: 'Детектор объектов на базе YOLOv8. Датасет, обучение, деплой на edge-устройство.',
    },
    tasks: [
      {
        key: 'GO2VLM-010',
        title: 'Собрать и разметить датасет',
        subtasks: [
          { key: 'GO2VLM-010-1', title: 'Снять 500 фото в 3 условиях освещения' },
          { key: 'GO2VLM-010-2', title: 'Разметить в CVAT (bounding boxes)' },
          { key: 'GO2VLM-010-3', title: 'Аугментация: flip, rotate, brightness' },
        ],
      },
      {
        key: 'GO2VLM-011',
        title: 'Обучить модель YOLOv8',
        subtasks: [
          { key: 'GO2VLM-011-1', title: 'Настроить конфиг обучения (epochs, lr, batch)' },
          { key: 'GO2VLM-011-2', title: 'Запустить на GPU-кластере' },
          { key: 'GO2VLM-011-3', title: 'Валидация: mAP > 0.75 на тестовой выборке' },
        ],
      },
      {
        key: 'GO2VLM-012',
        title: 'Деплой на edge-устройство',
        subtasks: [
          { key: 'GO2VLM-012-1', title: 'Конвертация модели в TensorRT' },
          { key: 'GO2VLM-012-2', title: 'Inference на Jetson Orin: > 15 FPS' },
        ],
      },
    ],
  },
  ai: {
    epic: {
      key: 'AISRV-E01',
      title: 'Собрать MVP AI-сервиса',
      desc: 'REST API + LLM-пайплайн + простой фронт. Пользователь загружает документ, получает резюме.',
    },
    tasks: [
      {
        key: 'AISRV-010',
        title: 'Backend: API для загрузки документов',
        subtasks: [
          { key: 'AISRV-010-1', title: 'Эндпоинт POST /upload (PDF, DOCX)' },
          { key: 'AISRV-010-2', title: 'Парсинг текста из документа' },
          { key: 'AISRV-010-3', title: 'Хранение в PostgreSQL + S3' },
        ],
      },
      {
        key: 'AISRV-011',
        title: 'LLM pipeline для суммаризации',
        subtasks: [
          { key: 'AISRV-011-1', title: 'Промпт-инженерия для резюме' },
          { key: 'AISRV-011-2', title: 'Интеграция с OpenAI API (fallback: local LLM)' },
          { key: 'AISRV-011-3', title: 'Rate limiting и кэширование ответов' },
        ],
      },
      {
        key: 'AISRV-012',
        title: 'Frontend: интерфейс загрузки',
        subtasks: [
          { key: 'AISRV-012-1', title: 'Форма загрузки с drag-and-drop' },
          { key: 'AISRV-012-2', title: 'Отображение результата с форматированием' },
        ],
      },
    ],
  },
  platform: {
    epic: {
      key: 'PLAT-E01',
      title: 'Базовая рабочая платформа',
      desc: 'Monorepo, CI/CD, авторизация, базовый API. Фундамент, на котором строится всё остальное.',
    },
    tasks: [
      {
        key: 'PLAT-010',
        title: 'Настройка monorepo и CI/CD',
        subtasks: [
          { key: 'PLAT-010-1', title: 'Структура: apps/ + packages/ + configs/' },
          { key: 'PLAT-010-2', title: 'GitHub Actions: lint + test + build' },
          { key: 'PLAT-010-3', title: 'Docker Compose для локальной разработки' },
        ],
      },
      {
        key: 'PLAT-011',
        title: 'Авторизация и управление пользователями',
        subtasks: [
          { key: 'PLAT-011-1', title: 'JWT auth с refresh-токенами' },
          { key: 'PLAT-011-2', title: 'RBAC: admin, member, viewer' },
          { key: 'PLAT-011-3', title: 'API-тесты для всех ролей' },
        ],
      },
      {
        key: 'PLAT-012',
        title: 'Базовый REST API',
        subtasks: [
          { key: 'PLAT-012-1', title: 'CRUD для основных сущностей' },
          { key: 'PLAT-012-2', title: 'Swagger-документация' },
        ],
      },
    ],
  },
};

const EXAMPLES_HELPER_STEPS = [
  'Не копируй примеры слово в слово.',
  'Смотри на логику декомпозиции.',
  'Сначала выделяй эпик.',
  'Потом задачи.',
  'Потом подзадачи.',
  'Если так не раскладывается — команда ещё не поняла, что делает.',
];


function TreeView({ project }) {
  return (
    <div className="ex-tree">
      {/* Epic */}
      <div className="ex-tree-node ex-tree-epic">
        <div className="ex-tree-icon">
          <SigilDiamond size={12} color="var(--color-accent-gold)" />
        </div>
        <div className="ex-tree-content">
          <div className="ex-tree-badge-row">
            <MonoBadge variant="gold">{project.epic.key}</MonoBadge>
            <span className="ex-tree-type" style={{ color: 'var(--color-accent-gold)' }}>Эпик</span>
          </div>
          <span className="ex-tree-name ex-tree-name--epic">{project.epic.title}</span>
          <p className="ex-tree-desc">{project.epic.desc}</p>
        </div>
      </div>

      {/* Tasks & Subtasks */}
      {project.tasks.map((task) => (
        <div key={task.key} className="ex-tree-group">
          <div className="ex-tree-node ex-tree-task">
            <span className="ex-tree-vline ex-tree-vline--1" />
            <div className="ex-tree-icon">
              <SigilDiamond size={9} color="var(--color-accent)" />
            </div>
            <div className="ex-tree-content">
              <div className="ex-tree-badge-row">
                <MonoBadge variant="ghost">{task.key}</MonoBadge>
                <span className="ex-tree-type" style={{ color: 'var(--color-accent)' }}>Задача</span>
              </div>
              <span className="ex-tree-name">{task.title}</span>
            </div>
          </div>

          {task.subtasks.map((sub, si) => (
            <div key={sub.key} className="ex-tree-node ex-tree-subtask">
              <span className="ex-tree-vline ex-tree-vline--1" />
              <span className="ex-tree-vline ex-tree-vline--2" />
              <div className="ex-tree-icon">
                <SigilDiamond size={6} color="var(--color-text-tertiary)" />
              </div>
              <div className="ex-tree-content">
                <MonoBadge variant="ghost">{sub.key}</MonoBadge>
                <span className="ex-tree-name ex-tree-name--sub">{sub.title}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export default function ExamplesSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });
  const [activeTab, setActiveTab] = useState('ros');

  return (
    <>
      <style>{CSS}</style>
      <section id="examples" ref={containerRef} className="ex">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="06" />
            <h2 className="ds-section-title">Примеры задач по типам проектов</h2>
          </div>

          <p className="ex-intro">
            Не копируй эти карточки слово в слово.
            Смотри на логику: идея - эпик - задачи - подзадачи.
            Если такая цепочка не собирается, проект пока не декомпозирован.
          </p>

          <div className="ex-divider">
            <DividerCircuitTrace />
          </div>

          <div data-reveal className="ex-tabs-wrap motion-reveal">
            <div className="ex-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`ex-tab ${activeTab === tab.id ? 'ex-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {activeTab === tab.id && <BracketOrnament text=">>" color="var(--color-accent)" />}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="ex-panel">
              <PanelCorners size={14} color="var(--color-border-strong)">
                <div className="ex-panel-inner">
                  <CardTopAccent color="var(--color-accent-gold)" width={48} />
                  <TreeView project={PROJECTS[activeTab]} />
                  <CardGlyphWatermark glyph="hexnode" size={160} />
                </div>
              </PanelCorners>
            </div>
          </div>

          <div data-reveal className="ex-guide-wrap motion-panel">
            <PanelCorners size={14} color="var(--color-border-strong)">
              <div className="ex-guide">
                <CardTopAccent color="var(--color-accent)" width={44} />
                <div className="ex-guide-head">
                  <MonoBadge variant="accent">гайд</MonoBadge>
                  <h3 className="ex-guide-title">Как пользоваться примерами ниже</h3>
                </div>
                <ul className="ex-guide-list">
                  {EXAMPLES_HELPER_STEPS.map((step, i) => (
                    <li key={step} className="ex-guide-step">
                      <span className="ex-guide-num">{String(i + 1).padStart(2, '0')}</span>
                      <SigilDiamond size={8} color="var(--color-accent)" />
                      <span className="ex-guide-text">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PanelCorners>
          </div>

          {/* ── CLOSING ── */}
          <div data-reveal className="ex-closing motion-reveal">
            <DividerDashedTerminal />
            <blockquote className="ex-closing-text">
              <SigilDiamond size={10} color="var(--color-accent-gold)" />
              <span>
                Если проект нельзя разложить на эпики, задачи и подзадачи,
                команда ещё не поняла, что именно она строит.
              </span>
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
  .ex {
    position: relative;
    padding-top: 2rem;
  }

  .ex-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  .ex-divider {
    margin-bottom: 2.5rem;
    max-width: 500px;
  }

  /* ── TABS ── */

  .ex-tabs-wrap { margin-bottom: 2rem; }

  .ex-guide-wrap {
    margin-bottom: 2rem;
    max-width: 900px;
  }

  .ex-guide {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.15rem 1.2rem 1.25rem;
    overflow: hidden;
  }

  .ex-guide-head {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
  }

  .ex-guide-title {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .ex-guide-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ex-guide-step {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .ex-guide-num {
    min-width: 1.45rem;
    padding-top: 2px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
  }

  .ex-guide-step > svg {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .ex-guide-text {
    font-family: var(--font-body);
    font-size: 0.84rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  .ex-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .ex-tab {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.875rem 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color var(--transition-fast), border-color var(--transition-base);
    position: relative;
    white-space: nowrap;
  }

  .ex-tab:hover { color: var(--color-text-secondary); }

  .ex-tab--active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
    box-shadow: 0 2px 0 0 var(--color-accent);
  }

  /* ── PANEL ── */

  .ex-panel {
    border: 1px solid var(--color-border);
    border-top: none;
  }

  .ex-panel-inner {
    position: relative;
    background: var(--color-surface);
    padding: 2rem;
    overflow: hidden;
  }

  /* ── TREE ── */

  .ex-tree {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ex-tree-node {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 0.75rem 0;
    position: relative;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .ex-tree-epic { padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }

  .ex-tree-task { padding-left: 28px; }
  .ex-tree-subtask { padding-left: 56px; }

  .ex-tree-vline {
    position: absolute;
    top: 0;
    width: 1px;
    height: 100%;
    background: var(--color-border);
  }

  .ex-tree-vline--1 { left: 16px; }
  .ex-tree-vline--2 { left: 44px; }

  .ex-tree-icon {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .ex-tree-content {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    flex: 1;
    min-width: 0;
  }

  .ex-tree-badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ex-tree-type {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .ex-tree-name {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text);
    font-weight: 500;
    line-height: 1.4;
  }

  .ex-tree-name--epic {
    font-size: 1rem;
    font-weight: 700;
  }

  .ex-tree-name--sub {
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    font-weight: 400;
  }

  .ex-tree-desc {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0.25rem 0 0;
  }

  .ex-tree-group {}

  /* ── CLOSING ── */

  .ex-closing { margin-top: 3rem; max-width: 700px; }

  .ex-closing-text {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text);
    font-style: italic;
    margin: 1.5rem 0 0;
    padding: 0;
    border: none;
    line-height: 1.6;
  }

  .ex-closing-text > svg { flex-shrink: 0; margin-top: 5px; }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .ex-tabs { flex-wrap: wrap; }
    .ex-tab { padding: 0.75rem 1rem; font-size: 0.72rem; }
  }

  @media (max-width: 640px) {
    .ex-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.5rem;
    }
    .ex-tabs {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 2px;
    }
    .ex-tabs::-webkit-scrollbar { display: none; }
    .ex-tab {
      padding: 0.62rem 0.78rem;
      font-size: 0.72rem;
      letter-spacing: 0.05em;
      white-space: nowrap;
      border: 1px solid var(--color-border);
      background: var(--color-bg-raised);
    }
    .ex-tab--active {
      border-color: var(--color-accent);
      background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface));
    }
    .ex-panel-inner { padding: 1rem; }
    .ex-guide {
      padding: 1rem 0.95rem 1.05rem;
    }
    .ex-guide-title {
      font-size: 0.75rem;
      line-height: 1.4;
    }
    .ex-guide-text {
      font-size: 0.84rem;
      line-height: 1.55;
    }
    .ex-tree-task { padding-left: 20px; }
    .ex-tree-subtask { padding-left: 40px; }
    .ex-tree-vline--1 { left: 12px; }
    .ex-tree-vline--2 { left: 32px; }
    .ex-tree-name { font-size: 0.86rem; line-height: 1.4; }
    .ex-tree-name--epic { font-size: 0.94rem; }
    .ex-tree-desc {
      font-size: 0.84rem;
      line-height: 1.55;
    }
  }
`;
