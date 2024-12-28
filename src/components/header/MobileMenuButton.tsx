import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button 
      className="sm:hidden p-2 text-white hover:text-primary transition-colors rounded-md hover:bg-primary/10"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <Menu size={24} />
    </button>
  );
};

export default MobileMenuButton;