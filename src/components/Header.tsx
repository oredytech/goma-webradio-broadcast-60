
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Mail, Search, Sun, Moon } from "lucide-react";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import NavigationLink from "./header/NavigationLink";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode toggle functionality
    // For example, adding/removing a class to the document or updating a context
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
                <NavigationLink to="/actualites">
                  Actualités
                </NavigationLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationLink to="/podcasts">
                  Podcasts
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationLink to="/a-propos">
                  À propos
                </NavigationLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={cn(
                      "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      "bg-primary text-white hover:bg-primary/80"
                    )}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contacts
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-secondary/95 backdrop-blur-sm text-white border border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-white">Nos coordonnées</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-gray-300 mt-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-primary">📍</span>
                        <p>RDCongo, Province du Nord-Kivu<br />
                          Ville de Goma/Commune de KARISIMBI</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">📞</span>
                        <div>
                          <p className="font-medium">Rédaction :</p>
                          <p>+243 851 006 476</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">📞</span>
                        <div>
                          <p className="font-medium">Direction :</p>
                          <p>+243 996886079</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">✉️</span>
                        <a href="mailto:contact@gomawebradio.com" className="hover:text-primary transition-colors">
                          contact@gomawebradio.com
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <button 
              className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className={cn(
                          "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          "bg-primary text-white hover:bg-primary/80"
                        )}>
                          <Mail className="mr-2 h-4 w-4" />
                          Contacts
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-secondary/95 backdrop-blur-sm text-white border border-primary/20">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-white">Nos coordonnées</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-gray-300 mt-4">
                          <div className="flex items-start space-x-3">
                            <span className="text-primary">📍</span>
                            <p>RDCongo, Province du Nord-Kivu<br />
                              Ville de Goma/Commune de KARISIMBI</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-primary">📞</span>
                            <div>
                              <p className="font-medium">Rédaction :</p>
                              <p>+243 851 006 476</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-primary">📞</span>
                            <div>
                              <p className="font-medium">Direction :</p>
                              <p>+243 996886079</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-primary">✉️</span>
                            <a href="mailto:contact@gomawebradio.com" className="hover:text-primary transition-colors">
                              contact@gomawebradio.com
                            </a>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </NavigationMenuItem>
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 rounded-full text-white hover:bg-primary/20 hover:text-primary transition-colors"
                      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                      onClick={toggleDarkMode}
                    >
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                  </div>
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

