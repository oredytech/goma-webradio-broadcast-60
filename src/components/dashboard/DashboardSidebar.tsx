
import { 
  BarChart2, 
  FileText, 
  Plus, 
  Settings, 
  LogOut, 
  Home 
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { DashboardTabType } from "@/components/dashboard/DashboardTabs";

interface DashboardSidebarProps {
  activeTab: DashboardTabType;
  onTabChange: (tab: DashboardTabType) => void;
  onNewArticleClick: () => void;
}

const DashboardSidebar = ({ 
  activeTab, 
  onTabChange, 
  onNewArticleClick 
}: DashboardSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center pl-2 gap-2">
          <img 
            src="/GOWERA__3_-removebg-preview.png" 
            alt="Goma Webradio" 
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg">Admin</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "analytics"}
                  onClick={() => onTabChange("analytics")}
                  tooltip="Statistiques"
                >
                  <BarChart2 />
                  <span>Statistiques</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "articles" && !activeTab.includes("new")}
                  onClick={() => onTabChange("articles")}
                  tooltip="Articles"
                >
                  <FileText />
                  <span>Articles</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "new-article"}
                  onClick={onNewArticleClick}
                  tooltip="Nouvel article"
                >
                  <Plus />
                  <span>Nouvel article</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "settings"}
                  onClick={() => onTabChange("settings")}
                  tooltip="Paramètres"
                >
                  <Settings />
                  <span>Paramètres</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Retour au site">
                  <Link to="/">
                    <Home />
                    <span>Retour au site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Déconnexion">
              <Link to="/login">
                <LogOut />
                <span>Déconnexion</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
