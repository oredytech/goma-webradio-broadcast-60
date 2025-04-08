
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsSection = () => {
  const news = [
    {
      title: "Nouveau programme musical",
      date: "9 Dec 2023",
      description: "Découvrez notre nouvelle émission dédiée à la musique congolaise moderne.",
      category: "Culture"
    },
    {
      title: "Interview exclusive",
      date: "8 Dec 2023",
      description: "Rencontre avec les artistes locaux de Goma.",
      category: "Société"
    },
    {
      title: "Débat politique",
      date: "7 Dec 2023",
      description: "Analyse des dernières évolutions politiques dans la région.",
      category: "Politique"
    },
    {
      title: "Nouveaux podcasts disponibles",
      date: "6 Dec 2023",
      description: "Notre collection de podcasts s'enrichit avec de nouveaux contenus.",
      category: "Médias"
    }
  ];

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Actualités</h2>
          <Button variant="ghost" className="gap-1 group">
            Toutes les actualités
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <Card 
              key={index}
              className="bg-card overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-primary/20 hover:translate-y-[-4px]"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{item.category}</Badge>
                  <span className="text-primary/80 text-sm">{item.date}</span>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <CardDescription className="text-muted-foreground line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent -ml-1 gap-1 group">
                  Lire la suite
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
