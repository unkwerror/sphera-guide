import { useScrollRevealAll } from '../../hooks/useScrollReveal';
import {
  SigilDiamond, SigilHexNode, SigilCrosshair,
  DividerNodeLine, DividerCircuitTrace, DividerDashedTerminal,
  PanelCorners,
  StatusDot, BracketOrnament,
  MonoBadge, StatusBadge,
  CardTopAccent, CardGlyphWatermark, CardIndexNum, SectionGhostNum,
  SigilBullet,
} from '../glyphs';


const ROLES = [
  {
    title: 'Team Lead',
    badge: 'TL',
    desc: 'Ведёт проект, распределяет задачи, следит за спринтами. Решает конфликты и блокеры. В Сфере: создаёт эпики, назначает приоритеты, контролирует дедлайны.',
  },
  {
    title: 'Backend / Systems',
    badge: 'BE',
    desc: 'Пишет серверную логику, API, базы данных. В Сфере: задачи по эндпоинтам, миграциям, интеграциям. Оценивает время на инфраструктуру.',
  },
  {
    title: 'Frontend / UI',
    badge: 'FE',
    desc: 'Интерфейс, компоненты, визуал. В Сфере: задачи по экранам, формам, адаптивности. Связка с дизайн-системой.',
  },
  {
    title: 'ML / CV / AI',
    badge: 'ML',
    desc: 'Модели, обучение, данные. В Сфере: задачи по датасетам, обучению, метрикам. Подзадачи на эксперименты.',
  },
  {
    title: 'Robotics / ROS',
    badge: 'ROS',
    desc: 'Навигация, контроллеры, датчики, железо. В Сфере: задачи по launch-файлам, калибровке, тестам на полигоне.',
  },
  {
    title: 'QA / Docs',
    badge: 'QA',
    desc: 'Тестирование и документация. В Сфере: задачи на тест-кейсы, Swagger-спеки, README. Часто совмещается с другой ролью.',
  },
];

const ANTI_PATTERNS = [
  {
    title: 'Один тащит всё',
    looks: 'У одного человека 12 задач, у остальных — 0. На канбане все карточки одного цвета.',
    danger: 'Когда этот человек выгорит или заболеет, проект встанет. Нет bus factor.',
    fix: 'Team Lead перераспределяет задачи в начале каждого спринта. Никто не берёт больше 3 задач одновременно.',
  },
  {
    title: 'Статус не обновляется',
    looks: 'На канбане задачи «В работе» уже вторую неделю. В комментариях тишина.',
    danger: 'Команда не видит реальную картину. На демо — сюрприз: ничего не готово.',
    fix: 'Обновлять статус каждый день. Если задача стоит 3+ дня — это блокер, пиши в комментарий.',
  },
  {
    title: 'Задача без исполнителя',
    looks: '«Кто-нибудь потом сделает». Задача висит в бэклоге неделями.',
    danger: 'Ничейная задача = несделанная задача. Она будет гореть перед дедлайном.',
    fix: 'Каждая задача в спринте обязана иметь исполнителя. Нет человека — не ставь в спринт.',
  },
  {
    title: 'Блокер только в чате',
    looks: '«Я написал в телегу, что жду API». В Сфере — тишина. Через неделю никто не помнит.',
    danger: 'Чат — поток. Блокер теряется через 20 сообщений. Нет трекинга, нет ответственного.',
    fix: 'Блокер = комментарий к задаче + статус «Заблокировано» + тег блокирующей задачи.',
  },
  {
    title: 'Гигантские задачи',
    looks: '«Сделать всю навигацию» — оценка 40 часов. Одна задача на весь спринт.',
    danger: 'Невозможно отследить прогресс. Невозможно параллелить. Невозможно демонстрировать.',
    fix: 'Декомпозиция: эпик → задачи (4-8ч) → подзадачи (1-2ч). Если > 8ч — дроби дальше.',
  },
  {
    title: 'Учёт времени игнорируется',
    looks: 'Оценка 4ч, факт 0ч. Или факт появляется в последний день — «ну, часов 6 наверное».',
    danger: 'Невозможно планировать следующий спринт. Невозможно понять, где перерасход.',
    fix: 'Списывать время в тот же день. Даже 30 минут. Это данные для всей команды.',
  },
];


export default function TeamSection() {
  const containerRef = useScrollRevealAll({ threshold: 0.08 });

  return (
    <>
      <style>{CSS}</style>
      <section id="team" ref={containerRef} className="tm">
        <div className="ds-section">

          <div className="ds-section-header">
            <SectionGhostNum num="07" />
            <h2 className="ds-section-title">Команда и ответственность</h2>
          </div>

          <p className="tm-intro">
            В проектной работе нет «кто-нибудь сделает». Есть конкретные роли,
            конкретные зоны ответственности и конкретные задачи в Сфере.
            Вот как это устроено.
          </p>

          <div className="tm-divider">
            <DividerCircuitTrace />
          </div>

          {/* ── ROLES GRID ── */}
          <div data-reveal className="tm-roles motion-reveal">
            <div className="tm-roles-label">
              <SigilHexNode size={18} color="var(--color-accent)" />
              <span>Роли в проекте</span>
            </div>
            <div className="tm-roles-grid">
              {ROLES.map((role, i) => (
                <div key={role.badge} className="tm-role-card motion-border">
                  <div className="tm-role-head">
                    <MonoBadge variant="accent">{role.badge}</MonoBadge>
                    <span className="tm-role-title">{role.title}</span>
                    <CardIndexNum num={String(i + 1).padStart(2, '0')} />
                  </div>
                  <p className="tm-role-desc">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── ANTI-PATTERNS ── */}
          <div data-reveal className="tm-anti motion-panel">
            <div className="tm-anti-header">
              <StatusDot status="error" size={8} />
              <span className="tm-anti-title">Что ломает проект</span>
            </div>
            <p className="tm-anti-desc">
              Шесть типичных антипаттернов. Если узнаёшь хотя бы два — проект уже в зоне риска.
            </p>

            <div className="tm-anti-grid">
              {ANTI_PATTERNS.map((ap, i) => (
                <div key={i} className="tm-anti-card">
                  <PanelCorners size={12} color="var(--color-border-strong)">
                    <div className="tm-anti-card-inner">
                      <CardTopAccent color="var(--color-error)" width={32} />
                      <div className="tm-anti-card-head">
                        <SigilBullet type="cross" size={14} color="var(--color-error)" />
                        <h4 className="tm-anti-card-title">{ap.title}</h4>
                      </div>

                      <div className="tm-anti-field">
                        <span className="tm-anti-field-label">Как выглядит</span>
                        <p className="tm-anti-field-text">{ap.looks}</p>
                      </div>

                      <div className="tm-anti-field">
                        <span className="tm-anti-field-label">Почему опасно</span>
                        <p className="tm-anti-field-text tm-anti-field-text--danger">{ap.danger}</p>
                      </div>

                      <div className="tm-anti-field">
                        <span className="tm-anti-field-label">Как исправить</span>
                        <p className="tm-anti-field-text tm-anti-field-text--fix">{ap.fix}</p>
                      </div>
                    </div>
                  </PanelCorners>
                </div>
              ))}
            </div>
          </div>

          {/* ── CLOSING ── */}
          <div data-reveal className="tm-closing motion-reveal">
            <DividerDashedTerminal />
            <blockquote className="tm-closing-text">
              <SigilDiamond size={10} color="var(--color-accent-gold)" />
              <span>
                Если команда не хочет видеть реальную картину проекта, никакая система не спасёт.
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
  .tm {
    position: relative;
    padding-top: 2rem;
  }

  .tm-intro {
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 680px;
    margin: 0 0 2.5rem;
  }

  .tm-divider {
    margin-bottom: 3rem;
    max-width: 600px;
  }

  /* ── ROLES ── */

  .tm-roles { margin-bottom: 4rem; }

  .tm-roles-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }

  .tm-roles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .tm-role-card {
    background: var(--color-surface);
    padding: 1.5rem;
    transition: background var(--transition-fast);
  }

  .tm-role-card:hover { background: var(--color-surface-hover); }

  .tm-role-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .tm-role-head > :last-child { margin-left: auto; }

  .tm-role-title {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .tm-role-desc {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  /* ── ANTI-PATTERNS ── */

  .tm-anti { margin-bottom: 3rem; }

  .tm-anti-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.75rem;
  }

  .tm-anti-title {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-error);
  }

  .tm-anti-desc {
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 2rem;
    max-width: 600px;
  }

  .tm-anti-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .tm-anti-card-inner {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.5rem;
    overflow: hidden;
  }

  .tm-anti-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tm-anti-card-head > svg { flex-shrink: 0; }

  .tm-anti-card-title {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text);
    margin: 0;
  }

  .tm-anti-field { margin-bottom: 1rem; }
  .tm-anti-field:last-child { margin-bottom: 0; }

  .tm-anti-field-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    display: block;
    margin-bottom: 0.3rem;
  }

  .tm-anti-field-text {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    margin: 0;
  }

  .tm-anti-field-text--danger { color: var(--color-error); }

  .tm-anti-field-text--fix { color: var(--color-accent); }

  /* ── CLOSING ── */

  .tm-closing { margin-top: 3rem; max-width: 700px; }

  .tm-closing-text {
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

  .tm-closing-text > svg { flex-shrink: 0; margin-top: 5px; }

  /* ── RESPONSIVE ── */

  @media (max-width: 1024px) {
    .tm-roles-grid { grid-template-columns: repeat(2, 1fr); }
    .tm-anti-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .tm-intro {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.5rem;
    }
    .tm-roles-grid { grid-template-columns: 1fr; }
    .tm-role-card { padding: 1.25rem; }
    .tm-role-title { font-size: 0.86rem; }
    .tm-role-desc {
      font-size: 0.88rem;
      line-height: 1.6;
    }
    .tm-anti-card-inner { padding: 1.25rem; }
    .tm-anti-card-title { font-size: 0.86rem; }
    .tm-anti-field-text {
      font-size: 0.84rem;
      line-height: 1.58;
    }
  }
`;
