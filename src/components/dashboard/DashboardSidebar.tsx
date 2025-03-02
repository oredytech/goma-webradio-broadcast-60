
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  Users, 
  Headphones, 
  Settings,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../header/Logo";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    content: true
  });

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const MenuItem = ({ 
    to, 
    icon: Icon, 
    label, 
    subMenu,
    menuKey
  }: { 
    to: string; 
    icon: React.ElementType; 
    label: string;
    subMenu?: boolean;
    menuKey?: string;
  }) => {
    const hasSubMenu = subMenu && menuKey;
    const isExpanded = hasSubMenu ? expandedMenus[menuKey as string] : false;

    return (
      <div className={cn(
        "relative",
        hasSubMenu && "mb-1"
      )}>
        {hasSubMenu ? (
          <button
            onClick={() => toggleMenu(menuKey as string)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md",
              "transition-colors text-gray-300 hover:text-white hover:bg-primary/20",
              "focus:outline-none",
              isExpanded && "text-white bg-primary/20"
            )}
          >
            <Icon className="h-5 w-5 mr-2" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-180"
                )} />
              </>
            )}
          </button>
        ) : (
          <NavLink
            to={to}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 text-sm rounded-md",
              "transition-colors text-gray-300 hover:text-white hover:bg-primary/20",
              "focus:outline-none",
              isActive && "text-white bg-primary/20"
            )}
          >
            <Icon className="h-5 w-5 mr-2" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "h-screen bg-secondary border-r border-primary/20 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        {!collapsed && <Logo />}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-primary/20"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <p className={cn(
            "text-xs uppercase font-semibold text-gray-500 mb-3 px-3",
            collapsed && "sr-only"
          )}>
            Navigation
          </p>
          <nav className="space-y-1">
            <MenuItem to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" />
            <MenuItem 
              to="#" 
              icon={FileText} 
              label="Contenus" 
              subMenu 
              menuKey="content" 
            />
            
            {expandedMenus.content && !collapsed && (
              <div className="ml-7 pl-2 border-l border-primary/20 space-y-1 my-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => cn(
                    "block px-3 py-2 text-sm rounded-md",
                    "transition-colors text-gray-300 hover:text-white hover:bg-primary/20",
                    isActive && "text-white bg-primary/20"
                  )}
                >
                  Articles
                </NavLink>
                <NavLink
                  to="/dashboard/podcasts"
                  className="block px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-primary/20"
                >
                  Podcasts
                </NavLink>
              </div>
            )}
            
            <MenuItem to="/dashboard/analytics" icon={BarChart2} label="Analytique" />
            <MenuItem to="/dashboard/users" icon={Users} label="Utilisateurs" />
            <MenuItem to="/dashboard/media" icon={Headphones} label="Médiathèque" />
          </nav>
        </div>
        
        <div>
          <p className={cn(
            "text-xs uppercase font-semibold text-gray-500 mb-3 px-3",
            collapsed && "sr-only"
          )}>
            Paramètres
          </p>
          <nav className="space-y-1">
            <MenuItem to="/dashboard/settings" icon={Settings} label="Configuration" />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;

