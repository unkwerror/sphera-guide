import { useEffect, useRef, useState } from 'react';
import {
  CardTopAccent,
  MonoBadge,
  PanelCorners,
  SigilDiamond,
} from '../glyphs';

export default function GuideVideo({
  src,
  title,
  caption,
  badge = 'webm demo',
  accent = 'var(--color-accent)',
  className = '',
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsInView(true);
          return;
        }
        setIsInView(false);
      },
      {
        rootMargin: '220px 0px',
        threshold: 0.1,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isInView) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
  }, [isInView, shouldLoad]);

  if (!src) return null;

  return (
    <div ref={wrapRef} className={`ds-video-wrap ${className}`.trim()}>
      <PanelCorners size={14} color="var(--color-border-strong)">
        <div className="ds-video-card">
          <CardTopAccent color={accent} width={48} />

          <div className="ds-video-head">
            <MonoBadge variant="ghost">{badge}</MonoBadge>
            <span className="ds-video-title">{title}</span>
          </div>

          <div className="ds-video-frame">
            <video
              ref={videoRef}
              className="ds-video-player"
              muted
              loop
              controls
              playsInline
              preload={shouldLoad ? 'metadata' : 'none'}
            >
              {shouldLoad ? <source src={src} type="video/webm" /> : null}
              Ваш браузер не поддерживает видео WebM.
            </video>
          </div>

          {caption ? (
            <p className="ds-video-caption">
              <SigilDiamond size={8} color="var(--color-accent-gold)" />
              <span>{caption}</span>
            </p>
          ) : null}
        </div>
      </PanelCorners>
    </div>
  );
}
