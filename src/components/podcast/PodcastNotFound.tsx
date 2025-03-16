
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PodcastNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Épisode non trouvé</h1>
        <p className="text-lg text-gray-300 mb-8">L'épisode que vous recherchez n'existe pas ou a été déplacé.</p>
        <Button 
          onClick={() => navigate('/podcasts')}
          variant="default"
        >
          Voir tous les podcasts
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default PodcastNotFound;
