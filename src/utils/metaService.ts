
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
  updateOrCreateMetaTag('og:site_name', metadata.siteName || 'GOMA WEBRADIO');
  updateOrCreateMetaTag('og:locale', metadata.locale || 'fr_FR');
  
  if (metadata.image) {
    // S'assurer que l'URL de l'image est absolue
    const imageUrl = metadata.image.startsWith('http') 
      ? metadata.image 
      : `${window.location.origin}${metadata.image.startsWith('/') ? '' : '/'}${metadata.image}`;
    
    // Mettre à jour directement les balises meta dans le head du document
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl);
    
    const ogImageSecure = document.querySelector('meta[property="og:image:secure_url"]');
    if (ogImageSecure) ogImageSecure.setAttribute('content', imageUrl.replace('http:', 'https:'));
    
    const ogImageWidth = document.querySelector('meta[property="og:image:width"]');
    if (ogImageWidth) ogImageWidth.setAttribute('content', '1200');
    
    const ogImageHeight = document.querySelector('meta[property="og:image:height"]');
    if (ogImageHeight) ogImageHeight.setAttribute('content', '630');
    
    const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (ogImageAlt) ogImageAlt.setAttribute('content', metadata.title);
    
    // Mettre à jour les éléments avec ID directement dans le HTML
    const ogImageById = document.getElementById('og-image');
    if (ogImageById) ogImageById.setAttribute('content', imageUrl);
    
    const twitterImageById = document.getElementById('twitter-image');
    if (twitterImageById) twitterImageById.setAttribute('content', imageUrl);
    
    const ogImageAltById = document.getElementById('og-image-alt');
    if (ogImageAltById) ogImageAltById.setAttribute('content', metadata.title);
    
    // Mettre à jour les balises Twitter
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', imageUrl);
  }
  
  if (metadata.url) {
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', metadata.url);
  } else {
    // Utiliser l'URL actuelle si aucune n'est spécifiée
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
  }
  
  // Mettre à jour les balises Twitter Card directement
  const twitterCard = document.querySelector('meta[property="twitter:card"]');
  if (twitterCard) twitterCard.setAttribute('content', 'summary_large_image');
  
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', metadata.title);
  
  const twitterDesc = document.querySelector('meta[property="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', metadata.description);
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
