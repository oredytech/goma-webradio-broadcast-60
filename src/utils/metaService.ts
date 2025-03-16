
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
  const imageUrl = forcedMetadata.image.startsWith('http') 
    ? forcedMetadata.image 
    : `${window.location.origin}${forcedMetadata.image.startsWith('/') ? '' : '/'}${forcedMetadata.image}`;
  
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
 */
export const resetMetaTags = (): void => {
  // Force les métadonnées par défaut
  updateMetaTags({
    title: "GOMA WEBRADIO",
    description: "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    image: "/GOWERA__3_-removebg-preview.png",
    type: "website",
    url: window.location.origin
  });
};

// Assurez-vous que les meta tags sont toujours présents
export const ensureMetaTags = (): void => {
  // Vérifier si les balises OG de base sont présentes
  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  
  // Si les balises OG ne sont pas présentes, initialiser avec les valeurs par défaut
  if (!ogTitleTag) {
    resetMetaTags();
  }
};

// Exposer les fonctions globalement pour l'accès depuis le HTML
if (typeof window !== 'undefined') {
  window.metaService = { 
    updateMetaTags, 
    resetMetaTags,
    ensureMetaTags
  };
  
  // Indiquer que le service est chargé
  if (window.initMetaTags) {
    window.initMetaTags();
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
