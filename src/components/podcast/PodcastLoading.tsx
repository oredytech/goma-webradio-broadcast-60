
import React from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/useSEO";

const PodcastLoading = () => {
  // Configurer le SEO pour la page de chargement
  usePageSEO(
    "Chargement du podcast",
    "Veuillez patienter pendant le chargement du podcast...",
    "/GOWERA__3_-removebg-preview.png"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-accent">
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
