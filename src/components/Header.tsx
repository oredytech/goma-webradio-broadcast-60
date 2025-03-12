
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import NavigationLink from "./header/NavigationLink";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = async () => {
    if (user) {
      try {
        await signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <NavigationMenu className="hidden sm:flex flex-1 justify-center">
            <NavigationMenuList className="flex items-center justify-center space-x-2">
              <NavigationMenuItem>
                <NavigationLink to="/">
                  Accueil
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
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

              <NavigationMenuItem>
                <NavigationLink to="/a-propos">
                  À propos
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                {user ? (
                  <NavigationLink 
                    to="#"
                    onClick={handleAuthClick}
                    className="bg-primary text-white hover:bg-primary/80"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </NavigationLink>
                ) : (
                  <NavigationLink 
                    to="/login"
                    className="bg-primary text-white hover:bg-primary/80"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </NavigationLink>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          {isMenuOpen && (
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
                    <NavigationLink to="/a-propos">
                      À propos
                    </NavigationLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full text-center">
                    {user ? (
                      <NavigationLink 
                        to="#"
                        onClick={handleAuthClick}
                        className="bg-primary text-white hover:bg-primary/80"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </NavigationLink>
                    ) : (
                      <NavigationLink 
                        to="/login"
                        className="bg-primary text-white hover:bg-primary/80"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                      </NavigationLink>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          <MobileMenuButton onClick={toggleMenu} className="sm:hidden ml-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
