
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ArticleErrorProps {
  onRetry: () => void;
}

const ArticleError = ({ onRetry }: ArticleErrorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Erreur de chargement</h1>
        <p className="text-lg text-gray-300">Impossible de charger les articles. Veuillez réessayer ultérieurement.</p>
        <Button 
          onClick={onRetry}
          className="mt-8"
        >
          Réessayer
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleError;
