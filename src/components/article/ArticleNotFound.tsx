
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ArticleNotFound = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-secondary dark:to-accent">
      <Header />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article non trouvé</h1>
          <p className="text-foreground/80 mb-8">
            Oh la la ! Il paraît qu'il y ait un problème.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="default">Retour à l'accueil</Button>
            </Link>
            <Link to="/recherche">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Rechercher un article
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
