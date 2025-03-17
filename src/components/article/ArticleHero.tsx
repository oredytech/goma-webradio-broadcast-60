
import React, { useEffect } from 'react';

interface ArticleHeroProps {
  title: string;
  featuredImageUrl: string;
  description?: string; // Ajout d'une description optionnelle
}

const ArticleHero = ({ title, featuredImageUrl, description }: ArticleHeroProps) => {
  // Mettre à jour les balises meta directement dans le composant
  useEffect(() => {
    // Titre de la page
    document.title = `${title} | GOMA WEBRADIO`;
    
    // Mise à jour des méta-tags pour SEO et Open Graph
    // Balises standards
    updateMetaTag('description', description || 'La voix de Goma - Actualités et informations');
    
    // Balises Open Graph
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description || 'La voix de Goma - Actualités et informations');
    updateMetaTag('og:image', getAbsoluteUrl(featuredImageUrl));
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'article');
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description || 'La voix de Goma - Actualités et informations');
    updateMetaTag('twitter:image', getAbsoluteUrl(featuredImageUrl));
    
    // Nettoyage lors du démontage
    return () => {
      // Réinitialiser au démontage si nécessaire
    };
  }, [title, featuredImageUrl, description]);
  
  return (
    <div className="pt-16">
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${featuredImageUrl || '/placeholder.svg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-3xl text-center mt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
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

// Helper function pour obtenir URL absolue
function getAbsoluteUrl(url: string): string {
  if (!url) return '';
  
  // Si l'URL est déjà absolue, la retourner
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Sinon, ajouter l'origine
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default ArticleHero;
