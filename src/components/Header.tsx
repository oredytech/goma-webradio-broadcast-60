import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-primary">Goma</span>
            <span className="text-xl sm:text-2xl font-light text-white">Webradio</span>
          </Link>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="hidden sm:flex">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                      "text-white"
                    )}
                  >
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    "text-white bg-transparent"
                  )}
                >
                  Actualités
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-secondary/95 backdrop-blur-sm p-4 rounded-md border border-primary/20">
                  <Link to="/actualites">
                    <NavigationMenuLink
                      className={cn(
                        "block w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md",
                      )}
                    >
                      Toutes les actualités
                    </NavigationMenuLink>
                  </Link>
                  <Link to="/actualites/politique">
                    <NavigationMenuLink
                      className={cn(
                        "block w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md",
                      )}
                    >
                      Politique
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                      "text-white"
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/login">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors",
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