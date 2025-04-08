
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ArticlesManagement from "@/components/dashboard/ArticlesManagement";
import ArticleForm from "@/components/dashboard/ArticleForm";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardTabs, { DashboardTabType } from "@/components/dashboard/DashboardTabs";
import SettingsPanel from "@/components/dashboard/SettingsPanel";

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

  return (
    <DashboardLayout
      title="Tableau de bord"
      description="Gérez vos articles et consultez les statistiques du site"
      action={
        <Button 
          onClick={handleNewArticleClick}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Nouvel article
        </Button>
      }
    >
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showNewArticleForm={showNewArticleForm}
        analytics={<AnalyticsDashboard />}
        articles={<ArticlesManagement />}
        newArticle={<ArticleForm />}
        settings={<SettingsPanel />}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
