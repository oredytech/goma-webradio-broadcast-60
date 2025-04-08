
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ArticlesManagement from "@/components/dashboard/ArticlesManagement";
import ArticleForm from "@/components/dashboard/ArticleForm";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { DashboardTabType } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTabType>("analytics");
  const [showNewArticleForm, setShowNewArticleForm] = useState<boolean>(false);

  const handleNewArticleClick = () => {
    setActiveTab("articles");
    setShowNewArticleForm(true);
  };

  const handleTabChange = (tab: DashboardTabType) => {
    setActiveTab(tab);
    if (tab !== "articles") {
      setShowNewArticleForm(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "articles":
        return showNewArticleForm ? <ArticleForm /> : <ArticlesManagement />;
      case "new-article":
        return <ArticleForm />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            onNewArticleClick={handleNewArticleClick}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {activeTab === "analytics" && "Statistiques"}
                    {activeTab === "articles" && (showNewArticleForm ? "Nouvel article" : "Articles")}
                    {activeTab === "new-article" && "Nouvel article"}
                    {activeTab === "settings" && "Paramètres"}
                  </h1>
                  {activeTab === "analytics" && (
                    <p className="text-muted-foreground mt-1">
                      Consultez les statistiques du site
                    </p>
                  )}
                  {activeTab === "articles" && !showNewArticleForm && (
                    <p className="text-muted-foreground mt-1">
                      Gérez les articles publiés sur le site
                    </p>
                  )}
                </div>
                {activeTab === "articles" && !showNewArticleForm && (
                  <Button 
                    onClick={handleNewArticleClick}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus size={16} />
                    Nouvel article
                  </Button>
                )}
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
