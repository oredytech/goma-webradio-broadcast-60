import { Link } from "react-router-dom";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavigationLink = ({ to, children, className }: NavigationLinkProps) => {
  return (
    <Link to={to} className="w-full sm:w-auto">
      <NavigationMenuLink
        className={cn(
          "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
          "text-white",
          className
        )}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  );
};

export default NavigationLink;