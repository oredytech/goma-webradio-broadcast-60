
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import NavigationLink from "./NavigationLink";
import ContactDialog from "./ContactDialog";

const DesktopNavigation = () => {
  return (
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
          <ContactDialog />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
