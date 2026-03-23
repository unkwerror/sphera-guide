import { useEffect, useMemo, useState } from 'react';

const CHARMS = {
  blink: {
    frames: [
      ` /\\_/\\
( o.o )
 (  ^  )`,
      ` /\\_/\\
( -.- )
 (  ^  )`,
      ` /\\_/\\
( o.o )
 (  v  )`,
      ` /\\_/\\
 ( o.o )
 (  ^  )`,
    ],
    durations: [860, 170, 280, 760],
  },
  typing: {
    frames: [
      ` /\\_/\\   .------.
( o.o )  | run  |
(  ^  )  '------'`,
      ` /\\_/\\   .------.
( -.o )  | run. |
(  ^  )  '------'`,
      ` /\\_/\\   .------.
( o.- )  | run..|
(  v  )  '------'`,
      ` /\\_/\\   .------.
( o.o )  | ready|
(  ^  )  '------'`,
      ` /\\_/\\   .------.
 ( o.o )  | done |
 (  ^  )  '------'`,
    ],
    durations: [380, 280, 280, 460, 720],
  },
  sleepy: {
    frames: [
      ` /\\_/\\
( -.- ) z
(  v  )`,
      ` /\\_/\\
( -.- ) zz
(  v  )`,
      ` /\\_/\\
( -.- ) zZz
(  v  )`,
      ` /\\_/\\
( o.o )
(  ^  )`,
      ` /\\_/\\
 ( -.- ) z
 (  v  )`,
    ],
    durations: [520, 560, 600, 240, 700],
  },
  panic: {
    frames: [
      ` /\\_/\\  !!!
 ( O.O )
 (  ^  )`,
      ` /\\_/\\  !?
 ( o.o )
 (  v  )`,
      ` /\\_/\\  !!!
 ( O.O )
 (  ^  )`,
      ` /\\_/\\
 ( -.- )
 (  v  )`,
    ],
    durations: [240, 210, 260, 620],
  },
  kickoff: {
    frames: [
      ` /\\_/\\  с чего начать?
 ( o.o )
 (  ?  )`,
      ` /\\_/\\  таски: @#$%
 ( O.O )
 (  v  )`,
      ` /\\_/\\  "не успеваем"
 ( O.O )
 (  v  )`,
      ` /\\_/\\  ...стоп, дышим
 ( -.- )
 (  ^  )`,
      ` /\\_/\\  старт: Мои задачи
 ( o.o )
 (  ^  )`,
      ` /\\_/\\  шаг за шагом
 ( ^.^ )
 (  ^  )`,
    ],
    durations: [520, 420, 520, 680, 860, 740],
  },
  kickoffHard: {
    frames: [
      ` /\\_/\\  с чего начать?!
 ( O.O )
 (  ?  )`,
      ` /\\_/\\  таски: @#$%
 ( O.O )
 (  v  )`,
      ` /\\_/\\  команда буксует
 ( O.O )
 (  v  )`,
      ` /\\_/\\  дедлайн уже здесь
 ( o.o )
 (  v  )`,
      ` /\\_/\\  стоп. один шаг
 ( -.- )
 (  ^  )`,
      ` /\\_/\\  старт: Мои задачи
 ( ^.^ )
 (  ^  )`,
    ],
    durations: [400, 340, 420, 460, 620, 700],
  },
  peek: {
    frames: [
      `   /\\_/\\
  ( o.o )
  (  ^  )`,
      `  _/\\_/\\
 | ( o.o )
 |_(  ^  )`,
      ` __/\\_/\\
   ( -.- )
   (  v  )`,
      `   /\\_/\\
  ( o.o )
  (  ^  )`,
    ],
    durations: [520, 280, 300, 680],
  },
  runner: {
    frames: [
      ` /\\_/\\__
( o.o )  )
 /  ^  /`,
      ` /\\_/\\__
( o.o )  )
/  ^  / `,
      ` /\\_/\\__
( o.o )  )
  ^  /  `,
      ` /\\_/\\__
( o.o )  )
 /  ^  /`,
    ],
    durations: [140, 140, 140, 260],
  },
  spark: {
    frames: ['..::..::..', '.:**..**:.', '..**::**..', '.:**..**:.'],
    durations: [280, 280, 280, 280],
  },
  wave: {
    frames: ['~.~~.~~.', '~~.~~.~~', '.~~.~~.~', '~~.~~.~~'],
    durations: [220, 220, 220, 220],
  },
};

const SIZE_MAP = {
  xs: '0.48rem',
  sm: '0.54rem',
  md: '0.62rem',
  lg: '0.76rem',
};

const COLOR_MAP = {
  muted: 'var(--color-text-tertiary)',
  soft: 'var(--color-text-secondary)',
  accent: 'var(--color-accent)',
  gold: 'var(--color-accent-gold)',
};

function hashSeed(value) {
  let hash = 0;
  const str = String(value ?? '');
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function AsciiCharm({
  variant = 'blink',
  size = 'sm',
  tone = 'muted',
  seed = '',
  staggerMs = 0,
  className = '',
  style,
}) {
  const charm = useMemo(() => CHARMS[variant] || CHARMS.blink, [variant]);
  const seedValue = useMemo(() => hashSeed(`${variant}:${tone}:${size}:${seed}`), [variant, tone, size, seed]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const startFrame = seedValue % charm.frames.length;

    if (media.matches) {
      setIdx(startFrame);
      return undefined;
    }

    let frame = startFrame;
    let timerId = null;
    const tick = () => {
      setIdx(frame);
      const baseDelay = charm.durations[frame] ?? 500;
      const jitterStep = ((seedValue + frame * 17) % 3) - 1;
      const occasionalHold = (seedValue + frame * 11) % 7 === 0 ? 90 : 0;
      const nextDelay = Math.max(120, baseDelay + jitterStep * 70 + occasionalHold);
      frame = (frame + 1) % charm.frames.length;
      timerId = window.setTimeout(tick, nextDelay);
    };

    setIdx(startFrame);
    timerId = window.setTimeout(tick, (seedValue % 260) + staggerMs);
    return () => window.clearTimeout(timerId);
  }, [charm, seedValue, staggerMs]);

  return (
    <pre
      aria-hidden
      className={className}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: SIZE_MAP[size] || SIZE_MAP.sm,
        lineHeight: 1.1,
        color: COLOR_MAP[tone] || COLOR_MAP.muted,
        userSelect: 'none',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'none',
        whiteSpace: 'pre',
        display: 'block',
        overflow: 'hidden',
        flexShrink: 0,
        pointerEvents: 'none',
        opacity: 0.95,
        ...style,
      }}
    >
      {charm.frames[idx]}
    </pre>
  );
}
