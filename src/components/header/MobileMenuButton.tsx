
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

const MobileMenuButton = ({ onClick, className }: MobileMenuButtonProps) => {
  return (
    <button 
      className={cn(
        "p-2 text-foreground dark:text-white hover:text-primary transition-colors rounded-md hover:bg-primary/10",
        className
      )}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <Menu size={24} />
    </button>
  );
};

export default MobileMenuButton;
