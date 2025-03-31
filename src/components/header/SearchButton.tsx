
import { Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <button 
      className="p-2 rounded-full text-foreground dark:text-white hover:bg-primary/20 hover:text-primary transition-colors"
      aria-label="Search"
      onClick={onClick}
    >
      <Search className="h-5 w-5" />
    </button>
  );
};

export default SearchButton;
