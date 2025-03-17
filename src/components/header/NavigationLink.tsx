
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  mobile?: boolean;
  onClick?: () => void;
}

const NavigationLink = ({ to, children, className, mobile, onClick }: NavigationLinkProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link to={to} className={cn("w-full sm:w-auto", mobile && "w-full")} onClick={handleClick}>
      <div
        className={cn(
          "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          "text-white",
          mobile && "text-lg py-3 h-auto",
          className
        )}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavigationLink;
