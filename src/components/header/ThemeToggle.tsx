
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // The toggle is shown but it's mostly for visual consistency
  // Light mode is enforced by the ThemeProvider
  return (
    <button 
      className="p-2 rounded-full text-secondary hover:bg-primary/20 hover:text-primary transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
