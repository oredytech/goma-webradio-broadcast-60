
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import VisitorsChart from "@/components/dashboard/VisitorsChart";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import ContentStatsChart from "@/components/dashboard/ContentStatsChart";
import SubscriberCard from "@/components/dashboard/SubscriberCard";
import DemographicsChart from "@/components/dashboard/DemographicsChart";
import { Navigate } from "react-router-dom";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Users, MousePointerClick, ArrowDown } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue, {user.displayName || user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </header>

          <Tabs defaultValue="apercu">
            <TabsList className="mb-8">
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="contenu">Contenu</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="apercu" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard 
                  title="Pages vues" 
                  value="12,452" 
                  changeType="positive"
                  change="+12.3%" 
                  description="Derniers 30 jours"
                  icon={<MousePointerClick className="h-4 w-4" />}
                />
                <AnalyticsCard 
                  title="Utilisateurs uniques" 
                  value="3,742" 
                  changeType="positive"
                  change="+8.7%" 
                  description="Derniers 30 jours"
                  icon={<Users className="h-4 w-4" />}
                />
                <AnalyticsCard 
                  title="Taux de rebond" 
                  value="32.1%" 
                  changeType="negative"
                  change="-4.2%" 
                  description="Derniers 30 jours"
                  icon={<ArrowDown className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VisitorsChart />
                <DemographicsChart />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SubscriberCard 
                  count="1,245" 
                  growth="+23" 
                />
                <SubscriberCard 
                  count="782" 
                  growth="+15" 
                />
                <SubscriberCard 
                  count="324" 
                  growth="+47" 
                />
                <SubscriberCard 
                  count="1,842" 
                  growth="+98" 
                />
              </div>
            </TabsContent>

            <TabsContent value="contenu" className="space-y-6">
              <ContentStatsChart />
              <Card>
                <CardHeader>
                  <CardTitle>Articles récents</CardTitle>
                  <CardDescription>Les derniers articles publiés sur votre site</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Liste des articles (à implémenter)</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience</CardTitle>
                  <CardDescription>Analyse de votre audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenu à venir</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parametres" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres</CardTitle>
                  <CardDescription>Gérez les paramètres de votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenu à venir</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
