
/**
 * Service pour gérer les balises meta et Open Graph
 */

export interface MetaData {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
  siteName?: string;
  locale?: string;
}

export const updateMetaTags = (metadata: MetaData): void => {
  // Mettre à jour le titre de la page
  document.title = `${metadata.title} | GOMA WEBRADIO`;
  
  // Mettre à jour ou créer les balises meta
  updateOrCreateMetaTag('description', metadata.description);
  
  // Mettre à jour ou créer les balises Open Graph
  updateOrCreateMetaTag('og:title', metadata.title);
  updateOrCreateMetaTag('og:description', metadata.description);
  updateOrCreateMetaTag('og:type', metadata.type || 'website');
  updateOrCreateMetaTag('og:url', metadata.url || window.location.href);
  updateOrCreateMetaTag('og:site_name', metadata.siteName || 'GOMA WEBRADIO');
  updateOrCreateMetaTag('og:locale', metadata.locale || 'fr_FR');
  
  // Créer les balises Open Graph pour l'image
  if (metadata.image) {
    // S'assurer que l'URL de l'image est absolue
    const imageUrl = metadata.image.startsWith('http') 
      ? metadata.image 
      : `${window.location.origin}${metadata.image.startsWith('/') ? '' : '/'}${metadata.image}`;
    
    updateOrCreateMetaTag('og:image', imageUrl);
    updateOrCreateMetaTag('og:image:secure_url', imageUrl.replace('http:', 'https:'));
    updateOrCreateMetaTag('og:image:width', '1200');
    updateOrCreateMetaTag('og:image:height', '630');
    updateOrCreateMetaTag('og:image:alt', metadata.title);
    
    // Mettre à jour les balises Twitter
    updateOrCreateMetaTag('twitter:image', imageUrl);
  }
  
  // Mettre à jour les balises Twitter Card
  updateOrCreateMetaTag('twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('twitter:title', metadata.title);
  updateOrCreateMetaTag('twitter:description', metadata.description);
  updateOrCreateMetaTag('twitter:url', metadata.url || window.location.href);
};

const updateOrCreateMetaTag = (name: string, content: string): void => {
  // Vérifier si c'est une balise de propriété ou de nom
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const attribute = isProperty ? 'property' : 'name';
  
  // Essayer de trouver la balise
  let tag = document.querySelector(selector) as HTMLMetaElement;
  
  // Si la balise n'existe pas, la créer
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  // Mettre à jour le contenu
  tag.setAttribute('content', content);
};

/**
 * Réinitialise les métadonnées aux valeurs par défaut du site
 */
export const resetMetaTags = (): void => {
  updateMetaTags({
    title: "GOMA WEBRADIO",
    description: "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    image: "/GOWERA__3_-removebg-preview.png",
    type: "website",
    url: window.location.origin
  });
};

// Exposer les fonctions globalement pour l'accès depuis le HTML
if (typeof window !== 'undefined') {
  window.metaService = { updateMetaTags, resetMetaTags };
  
  // Indiquer que le service est chargé
  if (window.initMetaTags) {
    window.initMetaTags();
  }
}
