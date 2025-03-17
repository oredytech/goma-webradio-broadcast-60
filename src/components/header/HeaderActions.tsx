
import ThemeToggle from "./ThemeToggle";
import SearchButton from "./SearchButton";

interface HeaderActionsProps {
  onSearchClick: () => void;
}

const HeaderActions = ({ onSearchClick }: HeaderActionsProps) => {
  return (
    <div className="hidden sm:flex items-center space-x-4">
      <SearchButton onClick={onSearchClick} />
      <ThemeToggle />
    </div>
  );
};

export default HeaderActions;
