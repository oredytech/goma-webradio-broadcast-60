
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Article non trouvé</h1>
        <p className="text-lg text-gray-300">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
        <Button 
          onClick={() => navigate("/actualites")}
          className="mt-8"
        >
          Voir tous les articles
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
