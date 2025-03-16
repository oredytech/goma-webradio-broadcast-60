
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import NavigationLink from "./header/NavigationLink";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";

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
            <NavigationMenuList className="flex items-center justify-center space-x-6">
              <NavigationMenuItem>
                <NavigationLink to="/">
                  Accueil
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationLink to="/actualites">
                  Actualités
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationLink to="/a-propos">
                  À propos
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                {user ? (
                  <Button 
                    onClick={handleAuthClick}
                    variant="outline"
                    className="bg-secondary hover:bg-secondary/80 text-white border border-primary/30 hover:border-primary/60 transition-all"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                ) : (
                  <Button 
                    asChild
                    variant="default"
                    className="bg-accent hover:bg-accent/80 text-white shadow-sm hover:shadow-md transition-all"
                  >
                    <NavigationLink to="/login" className="text-white hover:text-white">
                      <User className="mr-2 h-4 w-4" />
                      Espace membre
                    </NavigationLink>
                  </Button>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed sm:hidden inset-x-0 top-16 bg-secondary/95 backdrop-blur-sm border-t border-primary/20">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex flex-col items-center justify-center p-4 space-y-4 w-full">
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
                      <Button 
                        onClick={handleAuthClick}
                        variant="outline"
                        className="w-full bg-secondary hover:bg-secondary/80 text-white border border-primary/30 hover:border-primary/60 transition-all"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </Button>
                    ) : (
                      <Button 
                        asChild
                        variant="default"
                        className="w-full bg-accent hover:bg-accent/80 text-white shadow-sm hover:shadow-md transition-all"
                      >
                        <NavigationLink to="/login" className="text-white hover:text-white">
                          <User className="mr-2 h-4 w-4" />
                          Espace membre
                        </NavigationLink>
                      </Button>
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
