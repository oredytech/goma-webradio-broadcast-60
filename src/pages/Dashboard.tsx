
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart2, 
  Eye, 
  FilePenLine, 
  Users, 
  Search
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import VisitorsChart from "@/components/dashboard/VisitorsChart";
import ContentStatsChart from "@/components/dashboard/ContentStatsChart";
import DemographicsChart from "@/components/dashboard/DemographicsChart";
import SubscriberCard from "@/components/dashboard/SubscriberCard";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import { useGoogleAnalytics } from "@/utils/googleAnalytics";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Get Google Analytics data
  const { analyticsData, isLoading: isLoadingAnalytics, error: analyticsError } = useGoogleAnalytics();
  
  // Fetch articles
  const { data: articles, isLoading } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Show error toast if analytics data fails to load
  if (analyticsError && !toast.isActive) {
    toast({
      title: "Erreur de chargement",
      description: analyticsError,
      variant: "destructive",
    });
  }

  // Filter articles based on search term
  const filteredArticles = articles?.filter(article => {
    const title = new DOMParser().parseFromString(
      article.title.rendered, 
      'text/html'
    ).body.textContent || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="font-medium">AD</span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <AnalyticsCard
                title="Vues de page"
                value={`${analyticsData.pageViews}+`}
                description="Total des vues ce mois-ci"
                change="+5.2% depuis le mois dernier"
                changeType="positive"
                icon={<Eye className="h-5 w-5" />}
              />
              <AnalyticsCard
                title="Utilisateurs"
                value={analyticsData.visitors.toString()}
                description="Utilisateurs actifs par jour"
                change="+2.9% depuis la semaine dernière"
                changeType="positive"
                icon={<Users className="h-5 w-5" />}
              />
              <AnalyticsCard
                title="Articles"
                value={articles?.length.toString() || "0"}
                description="Articles publiés"
                change="+3 nouveaux articles cette semaine"
                changeType="positive"
                icon={<FilePenLine className="h-5 w-5" />}
              />
              <AnalyticsCard
                title="Trafic"
                value="500"
                description="Visiteurs uniques par jour"
                change="-1.5% depuis hier"
                changeType="negative"
                icon={<BarChart2 className="h-5 w-5" />}
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <VisitorsChart data={analyticsData.visitorsByDay} isLoading={isLoadingAnalytics} />
              </div>
              <div>
                <ContentStatsChart />
              </div>
            </div>
            
            {/* Second Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <DemographicsChart data={analyticsData.visitorsByCountry} isLoading={isLoadingAnalytics} />
              </div>
              <div>
                <SubscriberCard count="8,62k" growth="12%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
