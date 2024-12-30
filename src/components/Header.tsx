import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import NavigationLink from "./header/NavigationLink";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <NavigationMenu className="flex-1 justify-center">
            <NavigationMenuList className={cn(
              "sm:flex sm:items-center sm:justify-center sm:space-x-2 w-full",
              isMenuOpen ? 
                "absolute top-[64px] left-0 right-0 flex flex-col bg-secondary/95 backdrop-blur-sm p-4 space-y-3 border-t border-primary/20 animate-in slide-in-from-top-5 max-h-[calc(100vh-4rem)] overflow-y-auto" 
                : "hidden"
            )}>
              <NavigationMenuItem className="w-full sm:w-auto">
                <NavigationLink to="/">
                  Accueil
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full sm:w-auto">
                <NavigationMenuTrigger
                  className={cn(
                    "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    "text-white bg-transparent"
                  )}
                >
                  Actualités
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-secondary/95 backdrop-blur-sm p-4 rounded-md border border-primary/20">
                  <NavigationLink to="/actualites">
                    Toutes les actualités
                  </NavigationLink>
                  <NavigationLink to="/actualites/politique">
                    Politique
                  </NavigationLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full sm:w-auto">
                <NavigationLink to="/contact">
                  Contact
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full sm:w-auto">
                <NavigationLink 
                  to="/login"
                  className="bg-primary text-white hover:bg-primary/80"
                >
                  Se connecter
                </NavigationLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <MobileMenuButton onClick={toggleMenu} className="ml-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;