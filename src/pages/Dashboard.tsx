
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { BarChart2, FileText, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticlesManagement from "@/components/dashboard/ArticlesManagement";
import ArticleForm from "@/components/dashboard/ArticleForm";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("analytics");
  const [showNewArticleForm, setShowNewArticleForm] = useState<boolean>(false);

  const handleNewArticleClick = () => {
    setActiveTab("articles");
    setShowNewArticleForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 dark:bg-background">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos articles et consultez les statistiques du site
            </p>
          </div>

          <Button 
            onClick={handleNewArticleClick}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            Nouvel article
          </Button>
        </div>

        <Separator className="my-6" />

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            if (value !== "new-article") {
              setShowNewArticleForm(false);
            }
          }}
          className="space-y-6"
        >
          <div className="bg-card rounded-lg p-1 shadow-sm">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent">
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <BarChart2 size={16} className="mr-2" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger 
                value="articles"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText size={16} className="mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger 
                value="new-article"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Plus size={16} className="mr-2" />
                Nouvel article
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Settings size={16} className="mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            {showNewArticleForm ? (
              <ArticleForm />
            ) : (
              <ArticlesManagement />
            )}
          </TabsContent>

          <TabsContent value="new-article" className="space-y-6">
            <ArticleForm />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-foreground mb-4">Paramètres</h2>
              <p className="text-muted-foreground">
                Les paramètres du tableau de bord seront disponibles prochainement.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
