
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Logo = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-xl sm:text-2xl font-bold text-primary">{isDarkMode ? "Goma" : "Goma"}</span>
      <span className="text-xl sm:text-2xl font-light text-foreground dark:text-white">Webradio</span>
    </Link>
  );
};

export default Logo;
