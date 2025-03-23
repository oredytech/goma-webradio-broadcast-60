
import React from "react";
import { X } from "lucide-react";
import NavigationLink from "./NavigationLink";
import ContactDialog from "./ContactDialog";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import Logo from "./Logo";

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
      <SheetContent side="left" className="max-w-[280px] p-0 bg-secondary/95 backdrop-blur-sm border-r border-primary/20">
        <div className="flex justify-between items-center p-4">
          <Logo />
          <SheetClose className="text-white p-2" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </SheetClose>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 py-8">
          <NavigationLink to="/" mobile={true} onClick={onClose}>Accueil</NavigationLink>
          <NavigationLink to="/actualites" mobile={true} onClick={onClose}>Actualités</NavigationLink>
          <NavigationLink to="/podcasts" mobile={true} onClick={onClose}>Podcasts</NavigationLink>
          <NavigationLink to="/a-propos" mobile={true} onClick={onClose}>À propos</NavigationLink>
          <ContactDialog />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
