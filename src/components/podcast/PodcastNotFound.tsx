
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PodcastNotFound = () => {
  useEffect(() => {
    // Titre de la page
    document.title = `Podcast non trouvé | GOMA WEBRADIO`;
    
    // Mettre à jour les meta tags pour la page non trouvée
    // Balises standards
    updateMetaTag('description', "Le podcast que vous recherchez n'est pas disponible.");
    
    // Balises Open Graph
    updateMetaTag('og:title', "Podcast non trouvé | GOMA WEBRADIO");
    updateMetaTag('og:description', "Le podcast que vous recherchez n'est pas disponible.");
    updateMetaTag('og:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:title', "Podcast non trouvé | GOMA WEBRADIO");
    updateMetaTag('twitter:description', "Le podcast que vous recherchez n'est pas disponible.");
    updateMetaTag('twitter:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
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

export default PodcastNotFound;
