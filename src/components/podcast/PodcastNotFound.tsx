
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/useSEO";

const PodcastNotFound = () => {
  // Configurer le SEO pour la page non trouvée
  usePageSEO(
    "Podcast non trouvé",
    "Le podcast que vous recherchez n'est pas disponible.",
    "/GOWERA__3_-removebg-preview.png"
  );

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
