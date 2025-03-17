
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./header/Logo";
import MobileMenuButton from "./header/MobileMenuButton";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileNavigation from "./header/MobileNavigation";
import HeaderActions from "./header/HeaderActions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode toggle functionality
  };

  const handleSearchClick = () => {
    navigate('/recherche');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <DesktopNavigation />

          <HeaderActions 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            onSearchClick={handleSearchClick} 
          />

          <MobileNavigation 
            isOpen={isMenuOpen} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            onSearchClick={handleSearchClick} 
          />

          <MobileMenuButton onClick={toggleMenu} className="sm:hidden ml-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
