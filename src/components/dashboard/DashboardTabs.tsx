
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Settings, BarChart2 } from "lucide-react";

export type DashboardTabType = "analytics" | "articles" | "new-article" | "settings";

interface DashboardTab {
  id: DashboardTabType;
  label: string;
  icon: ReactNode;
}

interface DashboardTabsProps {
  activeTab: DashboardTabType;
  onTabChange: (tab: DashboardTabType) => void;
  showNewArticleForm?: boolean;
  analytics: ReactNode;
  articles: ReactNode;
  newArticle: ReactNode;
  settings: ReactNode;
}

const DashboardTabs = ({
  activeTab,
  onTabChange,
  showNewArticleForm = false,
  analytics,
  articles,
  newArticle,
  settings
}: DashboardTabsProps) => {
  const tabs: DashboardTab[] = [
    { id: "analytics", label: "Statistiques", icon: <BarChart2 size={16} className="mr-2" /> },
    { id: "articles", label: "Articles", icon: <FileText size={16} className="mr-2" /> },
    { id: "new-article", label: "Nouvel article", icon: <Plus size={16} className="mr-2" /> },
    { id: "settings", label: "Paramètres", icon: <Settings size={16} className="mr-2" /> }
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as DashboardTabType)}
      className="space-y-6"
    >
      <div className="bg-card rounded-lg p-1 shadow-sm">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="analytics" className="space-y-6">
        {analytics}
      </TabsContent>

      <TabsContent value="articles" className="space-y-6">
        {showNewArticleForm ? newArticle : articles}
      </TabsContent>

      <TabsContent value="new-article" className="space-y-6">
        {newArticle}
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        {settings}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
