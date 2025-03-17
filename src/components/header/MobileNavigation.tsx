
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import NavigationLink from "./NavigationLink";
import ContactDialog from "./ContactDialog";
import ThemeToggle from "./ThemeToggle";
import SearchButton from "./SearchButton";
import { Search } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSearchClick: () => void;
}

const MobileNavigation = ({ 
  isOpen, 
  isDarkMode, 
  toggleDarkMode, 
  onSearchClick 
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed sm:hidden inset-x-0 top-16 bg-secondary/95 backdrop-blur-sm border-t border-primary/20">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex flex-col items-center justify-center p-4 space-y-3 w-full">
          <NavigationMenuItem className="w-full text-center">
            <NavigationLink to="/">
              Accueil
            </NavigationLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full text-center">
            <NavigationLink to="/actualites">
              Actualités
            </NavigationLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full text-center">
            <NavigationLink to="/podcasts">
              Podcasts
            </NavigationLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full text-center">
            <NavigationLink to="/a-propos">
              À propos
            </NavigationLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full text-center">
            <ContactDialog />
          </NavigationMenuItem>
          <div className="flex items-center space-x-4 mt-2">
            <SearchButton onClick={onSearchClick} />
            <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default MobileNavigation;
