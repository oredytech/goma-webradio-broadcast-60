
import ThemeToggle from "./ThemeToggle";
import SearchButton from "./SearchButton";

interface HeaderActionsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSearchClick: () => void;
}

const HeaderActions = ({ 
  isDarkMode, 
  toggleDarkMode, 
  onSearchClick 
}: HeaderActionsProps) => {
  return (
    <div className="hidden sm:flex items-center space-x-4">
      <SearchButton onClick={onSearchClick} />
      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default HeaderActions;
