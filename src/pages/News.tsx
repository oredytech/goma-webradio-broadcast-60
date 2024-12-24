import { useQuery } from "@tanstack/react-query";
import { WordPressArticle } from "@/hooks/useWordpressArticles";

const News = () => {
  const { data: aupicArticles, isLoading: isLoadingAupic } = useQuery({
    queryKey: ["aupic-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://aupicinfo.com/wp-json/wp/v2/posts?_embed&per_page=5"
      );
      return response.json() as Promise<WordPressArticle[]>;
    },
  });

  const { data: kivuReporterArticles, isLoading: isLoadingKivuReporter } = useQuery({
    queryKey: ["kivureporter-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://kivureporter.net/wp-json/wp/v2/posts?_embed&per_page=5"
      );
      return response.json() as Promise<WordPressArticle[]>;
    },
  });

  const { data: kivu7Articles, isLoading: isLoadingKivu7 } = useQuery({
    queryKey: ["kivu7-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://kivu7.net/wp-json/wp/v2/posts?_embed&per_page=5"
      );
      return response.json() as Promise<WordPressArticle[]>;
    },
  });

  if (isLoadingAupic || isLoadingKivuReporter || isLoadingKivu7) {
    return <div className="min-h-screen flex items-center justify-center">Chargement des articles...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 Je vais mettre à jour le menu de navigation pour ajouter ces fonctionnalités. Commençons par restructurer le Header avec le menu déroulant pour Actualités et le bouton de connexion.

<lov-code>
First, let's update the Header component to include the new navigation items and dropdown menu:

<lov-write file_path="src/components/Header.tsx">
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
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
            <NavigationMenuList className="hidden sm:flex items-center space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                    "text-white"
                  )}
                  href="/"
                >
                  Accueil
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-primary">
                  Actualités
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <Link
                      to="/actualites/politique"
                      className="block p-2 hover:bg-primary/20 rounded-md text-white"
                    >
                      Politique
                    </Link>
                    <Link
                      to="/actualites"
                      className="block p-2 hover:bg-primary/20 rounded-md text-white"
                    >
                      Toutes les actualités
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                    "text-white"
                  )}
                  href="/programmes"
                >
                  Programmes
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/20 data-[state=open]:bg-primary/20",
                    "text-white"
                  )}
                  href="/contact"
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button variant="outline" className="text-white border-white hover:bg-primary/20 hover:text-primary">
                  Se connecter
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;