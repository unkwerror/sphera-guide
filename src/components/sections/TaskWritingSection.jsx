import { useState } from 'react';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode,
  DividerNodeLine, DividerCircuitTrace, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge,
  CardTopAccent, CardGlyphWatermark, CardIndexNum, SectionGhostNum,
  SigilBullet,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';


/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

const TABS = [
  { id: 'editor',   label: 'Редактор задач' },
  { id: 'smart',    label: 'SMART гид' },
  { id: 'examples', label: 'Примеры' },
  { id: 'guides',   label: 'Практика в Сфере' },
];

const BAD_EXAMPLES = [
  { text: 'Сделать робота',                    why: 'Что конкретно? Какого? За сколько? Кто?' },
  { text: 'Разобраться с навигацией',           why: 'Нет результата. Нет критерия «готово».' },
  { text: 'Пофиксить баги',                    why: 'Какие баги? Где? Когда?' },
  { text: 'Улучшить проект',                   why: 'Размытая цель без измеримого результата.' },
];

const GOOD_EXAMPLES = [
  { text: 'Калибровка LiDAR VLP-16 для indoor навигации — drift < 5cm на 10м. Спринт 2, 8ч, Петрова М.' },
  { text: 'Написать unit-тесты для PID-регулятора скорости — покрыть 3 режима (P, PI, PID), assert на setpoint ±2%. До пятницы.' },
  { text: 'Документация REST API контроллера захвата — Swagger-spec для 6 эндпоинтов, примеры запросов. 4ч, Иванов А.' },
  { text: 'Создать 3D-модель корпуса робота в Fusion 360 с точностью до 0.5мм. До конца спринта.' },
];

const SMART_RULES = [
  {
    letter: 'S', label: 'Specific', ru: 'Конкретная',
    desc: 'Что именно нужно сделать? Не «улучшить», а «реализовать», «настроить», «написать».',
    example: 'Реализовать obstacle avoidance на базе LiDAR для робоплатформы',
  },
  {
    letter: 'M', label: 'Measurable', ru: 'Измеримая',
    desc: 'Как понять, что задача выполнена? Нужен критерий: тест проходит, drift < 5cm, документация готова.',
    example: 'Робот объезжает 3 из 3 препятствий на тестовом полигоне',
  },
  {
    letter: 'A', label: 'Achievable', ru: 'Достижимая',
    desc: 'Реально ли сделать за спринт одним человеком? Если нет — разбей на подзадачи.',
    example: '8 часов работы, все зависимости (ROS2, датчик) уже есть',
  },
  {
    letter: 'R', label: 'Relevant', ru: 'Релевантная',
    desc: 'Зачем это нужно проекту? Задача должна двигать проект к цели, а не быть «для галочки».',
    example: 'Без навигации робот не поедет — это blocker для демо',
  },
  {
    letter: 'T', label: 'Time-bound', ru: 'Ограничена по времени',
    desc: 'Когда дедлайн? Сколько часов? В каком спринте? Без срока задача не существует.',
    example: 'Спринт 2, дедлайн 28.04, оценка 8ч',
  },
];

const CREATE_TASK_STEPS = [
  'Открой нужное пространство и нажми «Создать задачу».',
  'Заполни обязательные поля: Название, Пространство, Тип задачи, Приоритет.',
  'Добавь описание с критерием готовности: что именно проверяем в конце.',
  'Назначь исполнителя и владельца задачи.',
  'Укажи срок, оценку в часах и спринт (если задача уже запланирована).',
  'При необходимости добавь метки, вложения и связанные/дочерние задачи.',
  'Нажми «Сохранить» и сразу проверь, что задача попала в нужный статус.',
];

const TRACK_TASK_STEPS = [
  'Открой уже существующую задачу в режиме редактирования.',
  'Найди действие «Отслеживать задачу» в карточке.',
  'Добавь себя или других наблюдателей по ФИО.',
  'Подтверди выбор — после этого начнут приходить уведомления по изменениям.',
];

const STATUS_NOTES = [
  'Новый статус обычно создаёт только администратор процесса/пространства.',
  'Если добавить статус без переходов workflow, он не появится у команды.',
  'Обычный участник выбирает только существующие переходы в карточке задачи.',
];

const STATUS_REQUEST_TEMPLATE = [
  'Название статуса: «Ожидает данных»',
  'Зачем: блок для ML-задач без датасета',
  'Где стоит: между «Анализ» и «В работе»',
  'Кто использует: команда CV / AI',
];

const GUIDE_LINKS = [
  { label: 'Сфера.Задачи', url: 'https://www.sferaplatform.ru/sfera-zadachi' },
  { label: 'SaaS Сфера.Задачи', url: 'https://saas.sferaplatform.ru/products/tasks' },
  { label: 'Документация платформы', url: 'https://www.sferaplatform.ru/page71488711.html' },
];

const MOCK_TASK = {
  title: 'Калибровка LiDAR VLP-16 для indoor навигации',
  space: 'IRS1 · Навигация дрона',
  type: 'Задача',
  priority: 'Высокий',
  status: 'Создано',
  description: 'Настроить pointcloud pipeline для Velodyne VLP-16 и проверить drift < 5cm на 10м. Тест: коридор, открытое пространство, лестница.',
  assignee: 'Петрова М.',
  owner: 'Иванов А.',
  deadline: '28.04.2026',
  estimate: '8ч',
  sprint: 'Спринт 2',
  tags: ['навигация', 'LiDAR', 'калибровка'],
};


/* ═══════════════════════════════════════
   MOCK FORM HELPERS
   ═══════════════════════════════════════ */

function MockField({ label, value, required, accent }) {
  return (
    <div className="tw-field">
      <label className="tw-field-label">
        {label}{required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      <div className="tw-field-value" style={accent ? { color: 'var(--color-accent)', fontWeight: 600 } : undefined}>
        {value}
      </div>
    </div>
  );
}

function MockTextarea({ label, value }) {
  return (
    <div className="tw-field">
      <label className="tw-field-label">{label}</label>
      <div className="tw-field-textarea">{value}</div>
    </div>
  );
}

function MockSelect({ label, value, required, color }) {
  return (
    <div className="tw-field">
      <label className="tw-field-label">
        {label}{required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      <div className="tw-field-select">
        <span style={color ? { color } : undefined}>{value}</span>
        <span className="tw-field-chevron">v</span>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   TAB PANELS
   ═══════════════════════════════════════ */

function TabEditor() {
  return (
    <div className="tw-tab-content">
      <div className="tw-editor-label-row">
        <SigilHexNode size={20} color="var(--color-accent)" />
        <span className="tw-editor-label">Так выглядит хорошая задача в Сфере</span>
      </div>

      <div className="tw-editor-wrap">
        <PanelCorners size={16} color="var(--color-border-strong)">
          <div className="tw-editor">
            <CardTopAccent color="var(--color-accent-gold)" width={56} />

            <div className="tw-editor-header">
              <span className="tw-editor-title-label">Создание задачи</span>
              <MonoBadge variant="ghost">IRS1</MonoBadge>
            </div>

            <div className="tw-editor-title-field">
              <MockField label="Название" value={MOCK_TASK.title} required accent />
            </div>

            <div className="tw-editor-meta">
              <MockSelect label="Пространство" value={MOCK_TASK.space} required />
              <MockSelect label="Тип задачи" value={MOCK_TASK.type} required />
              <MockSelect label="Приоритет" value={MOCK_TASK.priority} required color="var(--color-error)" />
              <MockSelect label="Статус" value={MOCK_TASK.status} />
            </div>

            <div className="tw-editor-divider">
              <DividerDashedTerminal />
            </div>

            <div className="tw-editor-body">
              <div className="tw-editor-left">
                <MockTextarea label="Описание" value={MOCK_TASK.description} />
              </div>
              <div className="tw-editor-right">
                <MockField label="Исполнитель" value={MOCK_TASK.assignee} />
                <MockField label="Владелец" value={MOCK_TASK.owner} />
                <MockField label="Срок исполнения" value={MOCK_TASK.deadline} />
                <MockField label="Оценка" value={MOCK_TASK.estimate} />
                <MockSelect label="Спринт" value={MOCK_TASK.sprint} />
                <div className="tw-editor-tags">
                  <label className="tw-field-label">Метки</label>
                  <div className="tw-editor-tags-row">
                    {MOCK_TASK.tags.map(tag => (
                      <MonoBadge key={tag} variant="default">{tag}</MonoBadge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-editor-footer">
              <button type="button" className="ds-btn ds-btn--primary ds-btn--sm">Сохранить</button>
              <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm">Отменить</button>
            </div>

            <CardGlyphWatermark glyph="hexnode" size={160} />
          </div>
        </PanelCorners>
      </div>
    </div>
  );
}


function TabSmart() {
  return (
    <div className="tw-tab-content">
      <div className="tw-smart-divider">
        <DividerCircuitTrace />
      </div>

      <div className="tw-smart-grid">
        {SMART_RULES.map((rule, i) => (
          <div key={rule.letter} className="tw-smart-card motion-border">
            <div className="tw-smart-card-head">
              <span className="tw-smart-letter">{rule.letter}</span>
              <div>
                <span className="tw-smart-en">{rule.label}</span>
                <span className="tw-smart-ru">{rule.ru}</span>
              </div>
              <CardIndexNum num={String(i + 1).padStart(2, '0')} />
            </div>
            <p className="tw-smart-desc">{rule.desc}</p>
            <div className="tw-smart-example">
              <SigilDiamond size={8} color="var(--color-accent)" />
              <span>{rule.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function TabExamples() {
  return (
    <div className="tw-tab-content tw-examples">
      {/* BAD */}
      <div className="tw-ex-section">
        <div className="tw-ex-header">
          <StatusDot status="error" size={8} />
          <span className="tw-ex-title tw-ex-title--bad">Плохие примеры</span>
        </div>
        <div className="tw-ex-list">
          {BAD_EXAMPLES.map((ex, i) => (
            <div key={i} className="tw-ex-item tw-ex-item--bad">
              <SigilBullet type="cross" size={12} color="var(--color-error)" />
              <div>
                <span className="tw-ex-text">{ex.text}</span>
                <span className="tw-ex-why">{ex.why}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GOOD */}
      <div className="tw-ex-section">
        <div className="tw-ex-header">
          <StatusDot status="done" size={8} />
          <span className="tw-ex-title tw-ex-title--good">Хорошие примеры</span>
        </div>
        <div className="tw-ex-list">
          {GOOD_EXAMPLES.map((ex, i) => (
            <div key={i} className="tw-ex-item tw-ex-item--good">
              <SigilBullet type="diamond" size={12} color="var(--color-success)" />
              <span className="tw-ex-text">{ex.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TabGuides() {
  return (
    <div className="tw-tab-content tw-guides">
      <div className="tw-guides-grid">
        <div className="tw-guide-card motion-border">
          <div className="tw-guide-head">
            <SigilHexNode size={18} color="var(--color-accent)" />
            <span>Как добавить задачу в Сфере</span>
          </div>
          <ol className="tw-guide-list">
            {CREATE_TASK_STEPS.map((step) => (
              <li key={step} className="tw-guide-item">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="tw-guide-card motion-border">
          <div className="tw-guide-head">
            <SigilHexNode size={18} color="var(--color-accent-gold)" />
            <span>Как начать отслеживать задачу</span>
          </div>
          <ol className="tw-guide-list">
            {TRACK_TASK_STEPS.map((step) => (
              <li key={step} className="tw-guide-item">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="tw-guide-card motion-border">
          <div className="tw-guide-head">
            <StatusDot status="warning" size={7} />
            <span>Статусы и права доступа</span>
          </div>
          <ul className="tw-guide-bullets">
            {STATUS_NOTES.map((item) => (
              <li key={item} className="tw-guide-bullet">
                <SigilBullet type="diamond" size={9} color="var(--color-accent)" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="tw-guide-template">
            <span className="tw-guide-template-label">Шаблон запроса на новый статус</span>
            {STATUS_REQUEST_TEMPLATE.map((line) => (
              <div key={line} className="tw-guide-template-line">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tw-guide-links">
        {GUIDE_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tw-guide-link"
          >
            <SigilDiamond size={7} color="var(--color-accent)" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════ */

export default function TaskWritingSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });
  const [activeTab, setActiveTab] = useState('editor');

  return (
    <>
      <style>{CSS}</style>
      <section ref={containerRef} className="tw" id="task-writing">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="03" />
            <h2 className="ds-section-title">Как делать задачи</h2>
          </div>

          <p className="tw-intro">
            Уже половина семестра, а карточки выглядят как поток @#$%-мыслей? Знакомо.
            Здесь разберём, как делать задачи так, чтобы команда не врезалась в дедлайн лбом.
          </p>

          <div className="ds-ascii-strip ds-ascii-strip--soft">
            <AsciiCharm variant="typing" size="md" tone="accent" seed="task-typing" />
            <AsciiCharm variant="spark" size="xs" tone="gold" seed="task-spark" />
          </div>

          {/* ── TABS ── */}
          <div data-reveal className="tw-tabs-wrap motion-reveal">
            <div className="tw-tabs">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  className={`tw-tab ${activeTab === tab.id ? 'tw-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {activeTab === tab.id && (
                    <BracketOrnament text=">>" color="var(--color-accent)" />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="tw-panel">
              {activeTab === 'editor' && <TabEditor />}
              {activeTab === 'smart' && <TabSmart />}
              {activeTab === 'examples' && <TabExamples />}
              {activeTab === 'guides' && <TabGuides />}
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


/* ═══════════════════════════════════════
   STYLES
   ═══════════════════════════════════════ */

const CSS = `
  .tw {
    position: relative;
    padding-top: 2rem;
  }

  .tw-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  /* ── TABS ── */

  .tw-tabs-wrap {
    margin-bottom: 2rem;
  }

  .tw-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tw-tabs::-webkit-scrollbar { display: none; }

  .tw-tab {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.8rem 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color var(--transition-fast), border-color var(--transition-base);
    position: relative;
  }

  .tw-tab:hover {
    color: var(--color-text-secondary);
  }

  .tw-tab--active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
    box-shadow: 0 2px 0 0 var(--color-accent);
  }

  @media (max-width: 640px) {
    .tw-tab {
      padding: 0.75rem 1rem;
      font-size: 0.7rem;
    }
  }

  /* ── TAB PANEL ── */

  .tw-panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-top: none;
    overflow: hidden;
  }

  .tw-tab-content {
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    .tw-tab-content {
      padding: 1.25rem;
    }
  }

  /* ── EDITOR TAB ── */

  .tw-editor-label-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.25rem;
  }

  .tw-editor-label {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .tw-editor-wrap {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .tw-editor {
    position: relative;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .tw-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tw-editor-title-label {
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .tw-editor-title-field {
    padding: 0.65rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tw-editor-meta {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    background: var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  .tw-editor-meta > * {
    background: var(--color-bg-raised);
    padding: 0.55rem 0.75rem;
  }

  .tw-editor-divider { padding: 0.55rem 1rem; }

  .tw-editor-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-top: 1px solid var(--color-border-subtle);
  }

  .tw-editor-left {
    padding: 0.85rem 1rem;
    border-right: 1px solid var(--color-border);
  }

  .tw-editor-right {
    padding: 0.85rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tw-editor-tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.3rem;
  }

  .tw-editor-footer {
    display: flex;
    gap: 0.75rem;
    padding: 0.65rem 1rem;
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 1100px) {
    .tw-editor-meta { grid-template-columns: repeat(2, 1fr); }
    .tw-editor-body { grid-template-columns: 1fr; }
    .tw-editor-left {
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }
  }

  /* ── FORM MOCKS ── */

  .tw-field { display: flex; flex-direction: column; gap: 0.25rem; }

  .tw-field-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }

  .tw-field-value {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text);
    padding: 0.35rem 0;
    border-bottom: 1px solid var(--color-border-subtle);
    min-height: 1.8rem;
  }

  .tw-field-textarea {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    padding: 0.35rem 0;
    min-height: 64px;
  }

  .tw-field-select {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--color-text);
    padding: 0.35rem 0;
    border-bottom: 1px solid var(--color-border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tw-field-chevron {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--color-text-tertiary);
  }

  /* ── SMART TAB ── */

  .tw-smart-divider {
    margin-bottom: 1.5rem;
    max-width: 500px;
  }

  .tw-smart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .tw-smart-card {
    background: var(--color-bg-raised);
    padding: 1.5rem;
    transition: background var(--transition-fast);
  }

  .tw-smart-card:hover { background: var(--color-surface-hover); }

  .tw-smart-card-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .tw-smart-letter {
    font-family: var(--font-mono);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
    text-shadow: var(--glow-accent);
  }

  .tw-smart-en {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text);
    display: block;
  }

  .tw-smart-ru {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    display: block;
  }

  .tw-smart-card-head > :last-child { margin-left: auto; }

  .tw-smart-desc {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  .tw-smart-example {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 0.75rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border-subtle);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent);
    line-height: 1.5;
  }

  .tw-smart-example > svg { flex-shrink: 0; margin-top: 2px; }

  /* ── EXAMPLES TAB ── */

  .tw-examples {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .tw-ex-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
  }

  .tw-ex-title {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .tw-ex-title--bad  { color: var(--color-error); }
  .tw-ex-title--good { color: var(--color-success); }

  .tw-ex-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tw-ex-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 1rem 1.25rem;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
    transition: border-color var(--transition-fast);
  }

  .tw-ex-item:hover { border-color: var(--color-border-strong); }

  .tw-ex-item > svg { flex-shrink: 0; margin-top: 3px; }

  .tw-ex-text {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--color-text);
    display: block;
    line-height: 1.5;
  }

  .tw-ex-why {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--color-text-tertiary);
    font-style: italic;
    display: block;
    margin-top: 0.25rem;
  }

  /* ── GUIDES TAB ── */

  .tw-guides {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tw-guides-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    border: 1px solid var(--color-border);
    background: var(--color-border);
  }

  .tw-guide-card {
    background: var(--color-bg-raised);
    padding: 1.25rem;
  }

  .tw-guide-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
    margin-bottom: 0.9rem;
  }

  .tw-guide-list {
    margin: 0;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .tw-guide-item {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  .tw-guide-bullets {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tw-guide-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  .tw-guide-bullet > svg { flex-shrink: 0; margin-top: 3px; }

  .tw-guide-template {
    margin-top: 0.9rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    padding: 0.75rem;
  }

  .tw-guide-template-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: 0.4rem;
  }

  .tw-guide-template-line {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    line-height: 1.45;
  }

  .tw-guide-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tw-guide-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    text-decoration: none;
    border: 1px solid var(--color-border);
    background: var(--color-bg-raised);
    padding: 0.45rem 0.6rem;
    transition: border-color var(--transition-fast), color var(--transition-fast);
  }

  .tw-guide-link:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .tw-guide-link > svg { flex-shrink: 0; }

  @media (max-width: 1024px) {
    .tw-guides-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .tw-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.5rem;
    }

    .tw-tabs {
      gap: 0.25rem;
      padding-bottom: 2px;
    }

    .tw-tab {
      font-size: 0.74rem;
      padding: 0.72rem 0.85rem;
      letter-spacing: 0.06em;
      white-space: nowrap;
      border: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg-raised);
      margin-bottom: 1px;
    }

    .tw-tab--active {
      border-color: var(--color-accent);
      box-shadow: none;
      background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface));
    }

    .tw-tab-content {
      padding: 1rem;
    }

    .tw-editor-label {
      font-size: 0.74rem;
      letter-spacing: 0.07em;
    }

    .tw-editor-title-label {
      font-size: 1rem;
    }

    .tw-field-label {
      font-size: 0.72rem;
      letter-spacing: 0.05em;
    }

    .tw-field-value,
    .tw-field-select {
      font-size: 0.88rem;
      line-height: 1.45;
    }

    .tw-field-textarea {
      font-size: 0.86rem;
      line-height: 1.55;
    }

    .tw-smart-card {
      padding: 1.1rem;
    }

    .tw-smart-desc,
    .tw-guide-item,
    .tw-guide-bullet {
      font-size: 0.86rem;
      line-height: 1.55;
    }

    .tw-guide-head {
      font-size: 0.76rem;
    }

    .tw-guide-template-label {
      font-size: 0.7rem;
    }

    .tw-guide-template-line {
      font-size: 0.84rem;
    }

    .tw-guide-link {
      font-size: 0.72rem;
      padding: 0.5rem 0.62rem;
    }
  }
`;
