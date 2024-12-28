import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-primary">Goma</span>
            <span className="text-xl sm:text-2xl font-light text-white">Webradio</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 text-white hover:text-primary transition-colors rounded-md hover:bg-primary/10"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className={cn(
              "sm:flex sm:items-center sm:space-x-2",
              isMenuOpen ? "absolute top-16 left-0 right-0 flex flex-col bg-secondary/95 backdrop-blur-sm p-4 space-y-3 border-t border-primary/20 animate-in slide-in-from-top-5" : "hidden"
            )}>
              <NavigationMenuItem className="w-full sm:w-auto">
                <Link to="/" className="w-full sm:w-auto">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                      "text-white"
                    )}
                  >
                    Accueil
                  </NavigationMenuLink>
                </Link>
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
                  <Link to="/actualites">
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary",
                        "text-white"
                      )}
                    >
                      Toutes les actualités
                    </NavigationMenuLink>
                  </Link>
                  <Link to="/actualites/politique">
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary",
                        "text-white"
                      )}
                    >
                      Politique
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full sm:w-auto">
                <Link to="/contact" className="w-full sm:w-auto">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                      "text-white"
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full sm:w-auto">
                <Link to="/login" className="w-full sm:w-auto">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      "bg-primary text-white hover:bg-primary/80"
                    )}
                  >
                    Se connecter
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;