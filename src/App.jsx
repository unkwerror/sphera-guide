import { ThemeToggle } from './components/layout/ThemeToggle';
import Navigation from './components/layout/Navigation';
import { ScanlineOverlay, DividerGoldRitual } from './components/glyphs';
import { ASCIIText } from './components/ascii';
import DitherBackground from './components/background/DitherBackground';
import HeroSection from './components/sections/HeroSection';
import FirstStepsSection from './components/sections/FirstStepsSection';
import TaskWritingSection from './components/sections/TaskWritingSection';
import ScreensSection from './components/sections/ScreensSection';
import SprintSection from './components/sections/SprintSection';
import ExamplesSection from './components/sections/ExamplesSection';
import TeamSection from './components/sections/TeamSection';
import ContactSection from './components/sections/ContactSection';

function SectionBreak() {
  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '3rem 3rem' }}>
      <DividerGoldRitual />
    </div>
  );
}

function AsciiTransition() {
  return (
    <>
      <style>{`
        .ascii-transition {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ascii-transition-canvas {
          position: relative;
          width: 100%;
          max-width: 800px;
          height: 220px;
          overflow: hidden;
        }
        .ascii-transition-text {
          text-align: center;
          margin-top: 1rem;
        }
        .ascii-transition-subtitle {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin: 0 0 0.4rem;
          font-weight: 500;
        }
        .ascii-transition-institute {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--color-accent);
          text-transform: uppercase;
          font-weight: 600;
          text-shadow: var(--glow-accent);
        }
        @media (max-width: 640px) {
          .ascii-transition { padding: 1.5rem 1.5rem 2rem; }
          .ascii-transition-canvas { height: 160px; max-width: 500px; }
          .ascii-transition-subtitle { font-size: 0.8rem; }
          .ascii-transition-institute { font-size: 0.55rem; }
        }
      `}</style>
      <div className="ascii-transition">
        <div className="ascii-transition-canvas">
          <ASCIIText
            text="СФЕРА"
            asciiFontSize={6}
            textFontSize={200}
            textColor="#e0e4ec"
            planeBaseHeight={8}
            enableWaves={true}
          />
        </div>
        <div className="ascii-transition-text">
          <p className="ascii-transition-subtitle">
            Система управления проектами для инженеров
          </p>
          <div className="ascii-transition-institute">
            ИИР · Мехатроника и робототехника
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <DitherBackground />
      <ScanlineOverlay />
      <Navigation />
      <HeroSection />
      <AsciiTransition />
      <SectionBreak />
      <FirstStepsSection />
      <SectionBreak />
      <TaskWritingSection />
      <SectionBreak />
      <ScreensSection />
      <SectionBreak />
      <SprintSection />
      <SectionBreak />
      <ExamplesSection />
      <SectionBreak />
      <TeamSection />
      <SectionBreak />
      <ContactSection />
      <ThemeToggle />
    </>
  );
}
