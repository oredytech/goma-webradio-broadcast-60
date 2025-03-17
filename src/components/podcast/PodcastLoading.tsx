
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PodcastLoading = () => {
  useEffect(() => {
    // Titre de la page
    document.title = `Chargement du podcast | GOMA WEBRADIO`;
    
    // Mettre à jour les meta tags pour la page de chargement
    // Balises standards
    updateMetaTag('description', "Veuillez patienter pendant le chargement du podcast...");
    
    // Balises Open Graph
    updateMetaTag('og:title', "Chargement du podcast | GOMA WEBRADIO");
    updateMetaTag('og:description', "Veuillez patienter pendant le chargement du podcast...");
    updateMetaTag('og:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:title', "Chargement du podcast | GOMA WEBRADIO");
    updateMetaTag('twitter:description', "Veuillez patienter pendant le chargement du podcast...");
    updateMetaTag('twitter:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
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

// Helper function to mettre à jour les balises meta
function updateMetaTag(name: string, content: string) {
  // Vérifier s'il s'agit d'une propriété Open Graph ou d'un nom standard
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const attribute = isProperty ? 'property' : 'name';
  
  // Chercher la balise existante
  let tag = document.querySelector(selector) as HTMLMetaElement;
  
  // Créer la balise si elle n'existe pas
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  // Mettre à jour le contenu
  tag.setAttribute('content', content);
}

export default PodcastLoading;
