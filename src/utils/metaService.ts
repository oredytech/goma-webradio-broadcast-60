
/**
 * Service pour gérer les balises meta et Open Graph
 */

export interface MetaData {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
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
  
  if (metadata.image) {
    updateOrCreateMetaTag('og:image', metadata.image);
  }
  
  if (metadata.url) {
    updateOrCreateMetaTag('og:url', metadata.url);
  }
  
  // Mettre à jour les balises Twitter Card
  updateOrCreateMetaTag('twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('twitter:title', metadata.title);
  updateOrCreateMetaTag('twitter:description', metadata.description);
  
  if (metadata.image) {
    updateOrCreateMetaTag('twitter:image', metadata.image);
  }
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
