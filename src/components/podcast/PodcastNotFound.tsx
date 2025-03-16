
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { updateMetaTags } from "@/utils/metaService";

const PodcastNotFound = () => {
  useEffect(() => {
    // Mettre à jour les meta tags pour la page non trouvée
    updateMetaTags({
      title: "Podcast non trouvé",
      description: "Le podcast que vous recherchez n'est pas disponible.",
      type: "website",
      image: "/GOWERA__3_-removebg-preview.png"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">Podcast non trouvé</div>
        <p className="text-gray-300">
          Le podcast que vous recherchez n'est pas disponible ou a été supprimé.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PodcastNotFound;
