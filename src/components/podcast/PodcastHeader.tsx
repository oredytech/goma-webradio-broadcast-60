
import React, { useEffect } from 'react';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';

interface PodcastHeaderProps {
  episode: PodcastEpisode;
}

const PodcastHeader = ({ episode }: PodcastHeaderProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Podcast image failed to load:", episode.itunes?.image);
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };
  
  useEffect(() => {
    // Mettre à jour les métadonnées pour le podcast
    // Titre de la page
    document.title = `${episode.title} | GOMA WEBRADIO`;
    
    // Mise à jour des méta-tags pour SEO et Open Graph
    // Obtenir l'URL absolue de l'image
    const imageUrl = getAbsoluteUrl(episode.itunes?.image || '/placeholder.svg');
    
    // Balises standards
    updateMetaTag('description', episode.description || 'Écoutez ce podcast sur GOMA WEBRADIO');
    
    // Balises Open Graph
    updateMetaTag('og:title', episode.title);
    updateMetaTag('og:description', episode.description || 'Écoutez ce podcast sur GOMA WEBRADIO');
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'article'); // Type "article" pour les contenus médias
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', episode.title);
    updateMetaTag('twitter:description', episode.description || 'Écoutez ce podcast sur GOMA WEBRADIO');
    updateMetaTag('twitter:image', imageUrl);
  }, [episode]);

  return (
    <div className="aspect-video md:aspect-auto md:h-[400px] relative">
      <img 
        src={episode.itunes?.image || '/placeholder.svg'} 
        alt={episode.title}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
            {episode.title}
          </h1>
          <p className="text-gray-300 mb-4">
            {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
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

export default PodcastHeader;
