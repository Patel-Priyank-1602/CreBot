import { Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
      title={label}
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  );
}
