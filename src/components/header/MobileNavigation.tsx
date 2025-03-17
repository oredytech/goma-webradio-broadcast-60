
import React from "react";
import { X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SearchButton from "./SearchButton";
import NavigationLink from "./NavigationLink";

interface MobileNavigationProps {
  isOpen: boolean;
  onSearchClick: () => void;
}

const MobileNavigation = ({ 
  isOpen, 
  onSearchClick 
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="flex justify-end p-4">
        <button className="text-white p-2">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        <NavigationLink to="/" mobile>Accueil</NavigationLink>
        <NavigationLink to="/actualites" mobile>Actualités</NavigationLink>
        <NavigationLink to="/podcasts" mobile>Podcasts</NavigationLink>
        <NavigationLink to="/a-propos" mobile>À propos</NavigationLink>
        <NavigationLink to="/login" mobile>Connexion</NavigationLink>
        
        <div className="flex items-center space-x-4 mt-8">
          <SearchButton onClick={onSearchClick} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
