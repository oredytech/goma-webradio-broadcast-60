
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAnalyticsData } from "@/services/analyticsService";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Calendar as CalendarIcon, TrendingUp, Eye, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Convertir les dates pour l'API
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  // Récupérer les données analytiques
  const { data, isLoading, error } = useAnalyticsData(formattedStartDate, formattedEndDate);

  // Gestionnaire pour changer la période
  const handlePeriodChange = (value: string) => {
    const newPeriod = value as "7d" | "30d" | "90d" | "custom";
    setPeriod(newPeriod);
    
    const today = new Date();
    let newStartDate = new Date();
    
    switch (newPeriod) {
      case "7d":
        newStartDate.setDate(today.getDate() - 7);
        break;
      case "30d":
        newStartDate.setMonth(today.getMonth() - 1);
        break;
      case "90d":
        newStartDate.setMonth(today.getMonth() - 3);
        break;
      case "custom":
        // Garder les dates actuelles
        return;
    }
    
    setStartDate(newStartDate);
    setEndDate(today);
  };

  // Transformer les données pour le graphique
  const chartData = data?.mostViewedPages.map(page => ({
    page: page.title.length > 15 ? page.title.substring(0, 15) + '...' : page.title,
    vues: page.views
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Statistiques</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={period} onValueChange={handlePeriodChange} className="w-full md:w-auto">
            <TabsList className="bg-muted/30">
              <TabsTrigger value="7d">7 jours</TabsTrigger>
              <TabsTrigger value="30d">30 jours</TabsTrigger>
              <TabsTrigger value="90d">90 jours</TabsTrigger>
              <TabsTrigger value="custom">Personnalisé</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {period === "custom" && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-[180px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "dd MMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span>-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-[180px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "dd MMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">
              Erreur lors du chargement des données analytiques. Veuillez réessayer.
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cartes des métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Eye className="mr-2 h-4 w-4 text-blue-500" />
                  Pages vues
                </CardTitle>
                <CardDescription>Total sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data?.pageViews.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4 text-green-500" />
                  Visiteurs
                </CardTitle>
                <CardDescription>Visiteurs uniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data?.visitors.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-orange-500" />
                  Pages par visiteur
                </CardTitle>
                <CardDescription>Moyenne sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data ? (data.pageViews / data.visitors).toFixed(2) : '0'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique des pages les plus vues */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Pages les plus consultées</CardTitle>
              <CardDescription>
                Nombre de vues par page durant la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{}}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="page"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="vues" fill="#3b82f6" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tableaux des données */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Pages les plus consultées</CardTitle>
                <CardDescription>
                  Détail des pages avec le plus de trafic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Vues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.mostViewedPages.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Articles les plus consultés</CardTitle>
                <CardDescription>
                  Articles avec le plus de vues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead className="text-right">Vues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.articleViews.map((article, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell className="text-right">{article.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
