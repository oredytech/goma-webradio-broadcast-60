/**
 * Service pour gérer les balises meta et Open Graph
 * @deprecated Utilisez le hook useSEO à la place
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
  console.warn("updateMetaTags est déprécié, utilisez le hook useSEO à la place");
  
  // Forcer l'utilisation des meta tags spécifiés
  const forcedMetadata = {
    ...metadata,
    // S'assurer que l'image est toujours présente
    image: metadata.image || "/GOWERA__3_-removebg-preview.png",
    // Type par défaut pour les médias sociaux
    type: metadata.type || "website",
    // URL par défaut
    url: metadata.url || window.location.href,
    // Nom du site par défaut
    siteName: metadata.siteName || "GOMA WEBRADIO",
    // Locale par défaut
    locale: metadata.locale || "fr_FR"
  };
  
  // Mettre à jour le titre de la page
  document.title = `${forcedMetadata.title} | GOMA WEBRADIO`;
  
  // Mettre à jour ou créer les balises meta
  updateOrCreateMetaTag('description', forcedMetadata.description);
  
  // Mettre à jour ou créer les balises Open Graph
  updateOrCreateMetaTag('og:title', forcedMetadata.title);
  updateOrCreateMetaTag('og:description', forcedMetadata.description);
  updateOrCreateMetaTag('og:type', forcedMetadata.type);
  updateOrCreateMetaTag('og:url', forcedMetadata.url);
  updateOrCreateMetaTag('og:site_name', forcedMetadata.siteName);
  updateOrCreateMetaTag('og:locale', forcedMetadata.locale);
  
  // S'assurer que les balises Open Graph pour l'image sont toujours présentes
  // S'assurer que l'URL de l'image est absolue
  const imageUrl = getAbsoluteUrl(forcedMetadata.image);
  
  updateOrCreateMetaTag('og:image', imageUrl);
  updateOrCreateMetaTag('og:image:secure_url', imageUrl.replace('http:', 'https:'));
  updateOrCreateMetaTag('og:image:width', '1200');
  updateOrCreateMetaTag('og:image:height', '630');
  updateOrCreateMetaTag('og:image:alt', forcedMetadata.title);
  
  // Mettre à jour les balises Twitter
  updateOrCreateMetaTag('twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('twitter:title', forcedMetadata.title);
  updateOrCreateMetaTag('twitter:description', forcedMetadata.description);
  updateOrCreateMetaTag('twitter:url', forcedMetadata.url);
  updateOrCreateMetaTag('twitter:image', imageUrl);
  
  console.log('Meta tags forcés et mis à jour avec succès', forcedMetadata);
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
 * @deprecated Utilisez le hook useSEO à la place
 */
export const resetMetaTags = (): void => {
  console.warn("resetMetaTags est déprécié, utilisez le hook useSEO à la place");
  
  // Force les métadonnées par défaut
  updateMetaTags({
    title: "GOMA WEBRADIO",
    description: "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    image: "/GOWERA__3_-removebg-preview.png",
    type: "website",
    url: window.location.origin
  });
};

/**
 * Assurez-vous que les meta tags sont toujours présents
 * @deprecated Utilisez le hook useSEO à la place
 */
export const ensureMetaTags = (): void => {
  console.warn("ensureMetaTags est déprécié, utilisez le hook useSEO à la place");
  
  // Vérifier si les balises OG de base sont présentes
  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  
  // Si les balises OG ne sont pas présentes, initialiser avec les valeurs par défaut
  if (!ogTitleTag) {
    resetMetaTags();
  }
};

/**
 * Helper function to convert any URL to absolute URL
 */
export const getAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  
  // If the URL is already absolute, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the origin
  const origin = window.location.origin;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Exposer les fonctions globalement pour l'accès depuis le HTML
if (typeof window !== 'undefined') {
  (window as any).metaService = { 
    updateMetaTags, 
    resetMetaTags,
    ensureMetaTags
  };
  
  // Indiquer que le service est chargé
  if ((window as any).initMetaTags) {
    (window as any).initMetaTags();
  } else {
    // S'assurer que les meta tags sont présents même si initMetaTags n'est pas défini
    ensureMetaTags();
  }
  
  // S'assurer que les meta tags sont appliqués quand la page est complètement chargée
  window.addEventListener('load', () => {
    // Petit délai pour s'assurer que tout est bien chargé
    setTimeout(() => {
      ensureMetaTags();
    }, 100);
  });
}
