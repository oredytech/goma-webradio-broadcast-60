
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileNavigation from "./header/MobileNavigation";
import HeaderActions from "./header/HeaderActions";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchButton from "./header/SearchButton";
import ThemeToggle from "./header/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    if (isMenuOpen) {
      closeMenu();
    }
    navigate('/recherche');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20 dark:bg-secondary/80 dark:border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {!isMobile && <DesktopNavigation />}

          {!isMobile && (
            <HeaderActions onSearchClick={handleSearchClick} />
          )}
          
          {isMobile && (
            <div className="flex items-center space-x-2">
              <SearchButton onClick={handleSearchClick} />
              <ThemeToggle />
              <MobileMenuButton onClick={toggleMenu} />
            </div>
          )}

          <MobileNavigation 
            isOpen={isMenuOpen} 
            onSearchClick={handleSearchClick}
            onClose={closeMenu} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
