import { useTheme } from '../../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Переключить тему: сейчас ${theme === 'dark' ? 'тёмная' : 'светлая'}`}
      title={theme === 'dark' ? 'light mode' : 'dark mode'}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === 'dark' ? '◐' : '◑'}
      </span>
    </button>
  );
}
