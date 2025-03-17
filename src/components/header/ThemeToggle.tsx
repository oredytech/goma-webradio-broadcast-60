
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle = ({ isDarkMode, toggleDarkMode }: ThemeToggleProps) => {
  return (
    <button 
      className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
