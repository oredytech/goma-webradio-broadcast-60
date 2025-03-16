
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { updateMetaTags } from "@/utils/metaService";

const PodcastLoading = () => {
  useEffect(() => {
    // Mettre à jour les meta tags pour la page de chargement
    // En utilisant l'image par défaut de la radio
    updateMetaTags({
      title: "Chargement du podcast",
      description: "Veuillez patienter pendant le chargement du podcast...",
      type: "website",
      image: "/GOWERA__3_-removebg-preview.png"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-white">Chargement du podcast...</p>
      </div>
      <Footer />
    </div>
  );
};

export default PodcastLoading;
