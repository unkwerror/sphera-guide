import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'motion';
import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode,
  DividerNodeLine, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge,
  CardTopAccent, CardGlyphWatermark, SectionGhostNum,
  SigilBullet,
} from '../glyphs';
import AsciiCharm from '../ascii/AsciiCharm';
import GuideVideo from '../media/GuideVideo';


/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

const TABS = [
  { id: 'editor',   label: 'Редактор задач' },
  { id: 'examples', label: 'Примеры' },
  { id: 'guides',   label: 'Практика в Сфере' },
];

const BAD_EXAMPLES = [
  { text: 'Сделать backend',                    why: 'Слишком широко: неясно, какой кусок и где конец работы.' },
  { text: 'Разобраться с лидаром',              why: 'Нет критерия готовности. Как понять, что задача закрыта?' },
  { text: 'Пофиксить баги по навигации',        why: 'Какие баги, в каком модуле и в каком объеме?' },
  { text: 'Допилить интерфейс',                 why: 'Это не задача, а настроение. Нужны конкретные действия и артефакт.' },
];

const GOOD_EXAMPLES = [
  { text: 'Калибровать LiDAR VLP-16: добиться drift < 5 см на 10 м в 3 сценариях. Спринт 2, 8ч, Петрова М.' },
  { text: 'Написать unit-тесты для PID-регулятора: покрыть режимы P/PI/PID и зафиксировать setpoint ±2%. До пятницы.' },
  { text: 'Описать REST API контроллера в Swagger: 6 эндпоинтов + примеры запросов/ответов. 4ч, Иванов А.' },
  { text: 'Собрать экран профиля и вывести статусы задач из API. Definition of done: данные грузятся без моков.' },
];

const SMART_RULES = [
  {
    letter: 'S',
    title: 'Specific / Конкретика',
    check: 'Назови конкретное действие: что делаем, с чем работаем, какой результат ждём.',
  },
  {
    letter: 'M',
    title: 'Measurable / Проверяемость',
    check: 'Добавь критерий готовности: метрика, тест, артефакт или демонстрация.',
  },
  {
    letter: 'A',
    title: 'Achievable / Реалистичность',
    check: 'Объём должен быть подъёмным для одного человека в рамках спринта.',
  },
  {
    letter: 'R',
    title: 'Relevant / Польза проекту',
    check: 'Чётко ответь, зачем это нужно прямо сейчас и какую проблему это снимает.',
  },
  {
    letter: 'T',
    title: 'Time-bound / Срок',
    check: 'Укажи дедлайн, оценку в часах и спринт. Без срока задача не управляется.',
  },
];

const CREATE_TASK_STEPS = [
  'Нажми «Создать задачу».',
  'Впиши нормальное название, а не «доделать проект».',
  'В описании укажи, что именно надо сделать.',
  'Добавь критерий готовности.',
  'Назначь исполнителя.',
  'Укажи срок.',
  'Поставь оценку.',
  'Если уже идёт спринт — привяжи задачу к нему.',
  'Сохрани карточку.',
  'Если после сохранения задача всё ещё мутная — вернись и допиши.',
];

const TRACK_TASK_STEPS = [
  'Открой уже созданную задачу.',
  'Найди действие «Отслеживать задачу».',
  'Добавь себя в наблюдатели.',
  'Проверь, что теперь задача у тебя в отслеживаемых.',
  'Если не хочешь пропускать изменения — делай так на важных карточках.',
];

const IN_PROGRESS_STEPS = [
  'Открой карточку задачи.',
  'Поменяй статус на рабочий.',
  'Не держи реальную работу в статусе «Открыта».',
  'Если завис — напиши блокер в комментарии.',
];

const SMART_SAVE_GUIDE = [
  'Пойми, что именно делаем.',
  'Пойми, как проверяем результат.',
  'Убедись, что задачу реально вытянуть.',
  'Проверь, что она нужна проекту прямо сейчас.',
  'Укажи дедлайн, оценку и спринт.',
];

const GUIDE_LINKS = [
  { label: 'Документация платформы', url: 'https://www.sferaplatform.ru/page71488711.html' },
];

const TASK_CREATION_VIDEO = '/media/sfera/sozdnyecartochky.webm';

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

function SmartCriticalBlock({ blockRef }) {
  return (
    <div ref={blockRef} data-reveal className="tw-critical-wrap motion-panel">
      <PanelCorners size={14} color="var(--color-border-strong)">
        <div className="tw-critical">
          <CardTopAccent color="var(--color-error)" width={52} />

          <div className="tw-critical-head">
            <StatusDot status="warning" size={8} />
            <MonoBadge variant="accent">ОЧЕНЬ ВАЖНАЯ ИНФОРМАЦИЯ</MonoBadge>
          </div>

          <h3 className="tw-critical-title">SMART-проверка перед сохранением задачи</h3>
          <p className="tw-critical-subtitle">
            Если карточка не проходит SMART — не отправляй её в спринт.
            Сначала допиши задачу до рабочего состояния.
          </p>

          <div className="tw-critical-word" aria-hidden="true">
            {SMART_RULES.map((rule) => (
              <span key={rule.letter} className="tw-critical-word-letter">{rule.letter}</span>
            ))}
          </div>

          <div className="tw-critical-grid">
            {SMART_RULES.map((rule) => (
              <div key={rule.letter} className="tw-critical-item motion-border">
                <div className="tw-critical-item-head">
                  <span className="tw-critical-item-mark">{rule.letter}</span>
                  <span className="tw-critical-item-title">{rule.title}</span>
                </div>
                <span className="tw-critical-check">{rule.check}</span>
              </div>
            ))}
          </div>

          <p className="tw-critical-note">
            Минимум перед кнопкой «Сохранить»: что делаем, как проверяем, кто делает, когда дедлайн.
          </p>
        </div>
      </PanelCorners>
    </div>
  );
}

function SmartSaveGuide() {
  return (
    <div data-reveal className="tw-smart-helper-wrap motion-panel">
      <PanelCorners size={12} color="var(--color-border-strong)">
        <div className="tw-smart-helper">
          <CardTopAccent color="var(--color-accent-gold)" width={40} />
          <div className="tw-smart-helper-head">
            <MonoBadge variant="gold">helper</MonoBadge>
            <h4 className="tw-smart-helper-title">Как проверить задачу перед кнопкой «Сохранить»</h4>
          </div>
          <ul className="tw-smart-helper-list">
            {SMART_SAVE_GUIDE.map((step, i) => (
              <li key={step} className="tw-smart-helper-step">
                <span className="tw-smart-helper-num">{String(i + 1).padStart(2, '0')}</span>
                <SigilDiamond size={8} color="var(--color-accent)" />
                <span className="tw-smart-helper-text">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </PanelCorners>
    </div>
  );
}


function TabEditor() {
  return (
    <div className="tw-tab-content">
      <div className="tw-editor-label-row">
        <SigilHexNode size={20} color="var(--color-accent)" />
        <span className="tw-editor-label">Так выглядит рабочая карточка в Сфере</span>
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


function TabExamples() {
  return (
    <div className="tw-tab-content tw-examples">
      {/* BAD */}
      <div className="tw-ex-section">
        <div className="tw-ex-header">
          <StatusDot status="error" size={8} />
            <span className="tw-ex-title tw-ex-title--bad">Плохо: шум</span>
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
            <span className="tw-ex-title tw-ex-title--good">Хорошо: рабочая карточка</span>
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
            <StatusDot status="active" size={7} />
            <span>Как перевести задачу в работу</span>
          </div>
          <ol className="tw-guide-list">
            {IN_PROGRESS_STEPS.map((step) => (
              <li key={step} className="tw-guide-item">
                {step}
              </li>
            ))}
          </ol>
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
  const criticalRef = useRef(null);

  useEffect(() => {
    const root = criticalRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const controls = [];
    let hasAnimated = false;

    const run = () => {
      const panel = root.querySelector('.tw-critical');
      const title = root.querySelector('.tw-critical-title');
      const subtitle = root.querySelector('.tw-critical-subtitle');
      const note = root.querySelector('.tw-critical-note');
      const items = Array.from(root.querySelectorAll('.tw-critical-item'));

      if (panel) {
        controls.push(
          animate(
            panel,
            { opacity: [0.86, 1], y: [8, 0] },
            { duration: 0.45, ease: 'ease-out' },
          ),
        );
      }

      if (title || subtitle) {
        controls.push(
          animate(
            [title, subtitle].filter(Boolean),
            { opacity: [0, 1], y: [10, 0] },
            { delay: stagger(0.08), duration: 0.42, ease: 'ease-out' },
          ),
        );
      }

      if (items.length) {
        controls.push(
          animate(
            items,
            { opacity: [0, 1], y: [12, 0], filter: ['blur(2px)', 'blur(0px)'] },
            { delay: stagger(0.08, { from: 'first' }), duration: 0.5, ease: 'ease-out' },
          ),
        );
      }

      if (note) {
        controls.push(
          animate(
            note,
            { opacity: [0, 1] },
            { delay: 0.34, duration: 0.4, ease: 'ease-out' },
          ),
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible && !hasAnimated) {
          hasAnimated = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      controls.forEach((control) => control?.stop?.());
    };
  }, []);

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
            Если без голосового в Telegram задачу не понять - карточка написана плохо.
            Ниже короткий минимум, который превращает «что-то поделать» в задачу,
            с которой команда реально может работать.
          </p>

          <div className="ds-ascii-strip ds-ascii-strip--soft">
            <AsciiCharm variant="typing" size="md" tone="accent" seed="task-typing" />
            <AsciiCharm variant="spark" size="xs" tone="gold" seed="task-spark" />
          </div>

          <SmartCriticalBlock blockRef={criticalRef} />
          <SmartSaveGuide />

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
              {activeTab === 'examples' && <TabExamples />}
              {activeTab === 'guides' && <TabGuides />}
            </div>
          </div>

          <GuideVideo
            className="tw-video-outside"
            src={TASK_CREATION_VIDEO}
            badge="task create / webm"
            title="Создание задачи в реальном интерфейсе"
            caption="Проверь после сохранения: карточка не мутная, проходит SMART и сразу понятна всей команде."
            accent="var(--color-accent-gold)"
          />

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

  /* ── CRITICAL SMART BLOCK ── */

  .tw-critical-wrap {
    margin-bottom: 1.6rem;
  }

  .tw-critical {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.2rem 1.3rem 1.35rem;
    overflow: hidden;
    isolation: isolate;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--color-accent-gold) 22%, transparent),
      0 0 24px color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .tw-critical > * {
    position: relative;
    z-index: 1;
  }

  .tw-critical::before {
    content: '';
    position: absolute;
    inset: -1px;
    pointer-events: none;
    border: 1px solid color-mix(in srgb, var(--color-accent-gold) 45%, transparent);
    opacity: 0.42;
    z-index: 0;
  }

  .tw-critical-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.75rem;
  }

  .tw-critical-title {
    font-family: var(--font-mono);
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
    margin: 0 0 0.55rem;
  }

  .tw-critical-subtitle {
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    margin: 0 0 0.95rem;
    max-width: 860px;
  }

  .tw-critical-word {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
    margin: 0 0 0.7rem;
  }

  .tw-critical-word-letter {
    font-family: var(--font-mono);
    font-size: 1.85rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.06em;
    color: var(--color-accent);
    text-shadow: var(--glow-accent);
    background: color-mix(in srgb, var(--color-bg-raised) 88%, transparent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
  }

  .tw-critical-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
    margin-bottom: 0.75rem;
  }

  .tw-critical-item {
    background: color-mix(in srgb, var(--color-bg-raised) 88%, transparent);
    padding: 0.72rem 0.76rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    border: 1px solid transparent;
    min-height: 142px;
  }

  .tw-critical-item-head {
    display: flex;
    align-items: center;
    gap: 0.42rem;
  }

  .tw-critical-item-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.45rem;
    height: 1.45rem;
    font-family: var(--font-mono);
    font-size: 0.96rem;
    font-weight: 700;
    line-height: 1;
    color: var(--color-accent);
    border: 1px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .tw-critical-item-title {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-text);
    font-weight: 700;
    line-height: 1.3;
  }

  .tw-critical-check {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    line-height: 1.46;
  }

  .tw-critical-note {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.83rem;
    color: var(--color-accent-gold);
    line-height: 1.55;
    padding-top: 0.7rem;
    border-top: 1px solid var(--color-border);
    font-weight: 500;
  }

  .tw-smart-helper-wrap {
    margin: 0 0 1.25rem;
    max-width: 980px;
  }

  .tw-smart-helper {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 0.95rem 1rem 1.05rem;
    overflow: hidden;
  }

  .tw-smart-helper-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.72rem;
    flex-wrap: wrap;
  }

  .tw-smart-helper-title {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .tw-smart-helper-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.46rem;
  }

  .tw-smart-helper-step {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .tw-smart-helper-num {
    min-width: 1.4rem;
    padding-top: 2px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
  }

  .tw-smart-helper-step > svg {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .tw-smart-helper-text {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .tw-critical::before {
      opacity: 0.4;
    }
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

  .tw-video-outside {
    max-width: 980px;
    margin: 1rem auto 0;
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

  @media (max-width: 900px) {
    .tw-critical-word {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .tw-critical-word-letter {
      font-size: 1.52rem;
    }

    .tw-critical-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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

    .tw-critical {
      padding: 1rem 0.95rem 1.1rem;
    }

    .tw-critical-title {
      font-size: 0.8rem;
      line-height: 1.35;
    }

    .tw-critical-subtitle {
      font-size: 0.84rem;
      line-height: 1.5;
      margin-bottom: 0.8rem;
    }

    .tw-critical-grid {
      grid-template-columns: 1fr;
    }

    .tw-critical-word {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      margin-bottom: 0.62rem;
    }

    .tw-critical-word-letter {
      font-size: 1.22rem;
      padding: 0.42rem 0;
    }

    .tw-critical-item {
      padding: 0.66rem 0.72rem;
      min-height: auto;
      gap: 0.45rem;
    }

    .tw-critical-item-head {
      gap: 0.38rem;
    }

    .tw-critical-item-mark {
      width: 1.3rem;
      height: 1.3rem;
      font-size: 0.86rem;
    }

    .tw-critical-item-title {
      font-size: 0.64rem;
    }

    .tw-critical-check {
      font-size: 0.8rem;
      line-height: 1.45;
    }

    .tw-critical-note {
      font-size: 0.8rem;
      line-height: 1.5;
      padding-top: 0.62rem;
    }

    .tw-smart-helper {
      padding: 0.88rem 0.88rem 0.95rem;
    }

    .tw-smart-helper-title {
      font-size: 0.72rem;
      line-height: 1.4;
    }

    .tw-smart-helper-text {
      font-size: 0.82rem;
      line-height: 1.54;
    }

    .tw-critical::before {
      opacity: 0.36;
    }

    .tw-editor-label {
      font-size: 0.74rem;
      letter-spacing: 0.07em;
    }

    .tw-editor-title-label {
      font-size: 1rem;
    }

    .tw-video-outside {
      margin-top: 0.85rem;
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
