
import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <button 
      className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
      aria-label="Search"
      onClick={onClick}
    >
      <Search className="h-5 w-5" />
    </button>
  );
};

export default SearchButton;
