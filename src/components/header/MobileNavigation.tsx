
import React from "react";
import { X } from "lucide-react";
import NavigationLink from "./NavigationLink";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

interface MobileNavigationProps {
  isOpen: boolean;
  onSearchClick: () => void;
  onClose: () => void;
}

const MobileNavigation = ({ 
  isOpen, 
  onSearchClick,
  onClose
}: MobileNavigationProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 bg-secondary/95 backdrop-blur-sm border-r border-primary/20">
        <div className="flex justify-end p-4">
          <SheetClose className="text-white p-2" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </SheetClose>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 py-8">
          <NavigationLink to="/" mobile={true} onClick={onClose}>Accueil</NavigationLink>
          <NavigationLink to="/actualites" mobile={true} onClick={onClose}>Actualités</NavigationLink>
          <NavigationLink to="/podcasts" mobile={true} onClick={onClose}>Podcasts</NavigationLink>
          <NavigationLink to="/a-propos" mobile={true} onClick={onClose}>À propos</NavigationLink>
          <NavigationLink to="/login" mobile={true} onClick={onClose}>Connexion</NavigationLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
