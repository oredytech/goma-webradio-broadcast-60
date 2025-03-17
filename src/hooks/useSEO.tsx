
import { useEffect } from 'react';

export interface MetaData {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'video' | 'audio';
  url?: string;
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

/**
 * Hook pour gérer les métadonnées SEO et les tags Open Graph
 * @param metadata Les métadonnées à définir pour la page actuelle
 */
export function useSEO(metadata: MetaData) {
  useEffect(() => {
    // Valeurs par défaut
    const defaultSiteName = "GOMA WEBRADIO";
    const defaultImage = "/GOWERA__3_-removebg-preview.png";
    const defaultLocale = "fr_FR";
    
    // Fusionner les métadonnées fournies avec les valeurs par défaut
    const metaValues = {
      title: metadata.title,
      description: metadata.description,
      image: metadata.image || defaultImage,
      type: metadata.type || 'website',
      url: metadata.url || window.location.href,
      siteName: metadata.siteName || defaultSiteName,
      locale: metadata.locale || defaultLocale,
      author: metadata.author || defaultSiteName,
      publishedTime: metadata.publishedTime,
      modifiedTime: metadata.modifiedTime,
      twitterCard: metadata.twitterCard || 'summary_large_image',
    };
    
    // S'assurer que l'URL de l'image est absolue
    const imageUrl = getAbsoluteUrl(metaValues.image);
    
    // Définir le titre de la page
    document.title = `${metaValues.title}${metaValues.title.includes(defaultSiteName) ? '' : ` | ${defaultSiteName}`}`;
    
    // Balises meta standards
    updateMetaTag('description', metaValues.description);
    updateMetaTag('author', metaValues.author);
    
    // Balises Open Graph
    updateMetaTag('og:title', metaValues.title);
    updateMetaTag('og:description', metaValues.description);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:url', metaValues.url);
    updateMetaTag('og:type', metaValues.type);
    updateMetaTag('og:site_name', metaValues.siteName);
    updateMetaTag('og:locale', metaValues.locale);
    
    // Balises additionnelles pour les articles
    if (metaValues.type === 'article') {
      if (metaValues.publishedTime) {
        updateMetaTag('article:published_time', metaValues.publishedTime);
      }
      if (metaValues.modifiedTime) {
        updateMetaTag('article:modified_time', metaValues.modifiedTime);
      }
      updateMetaTag('article:author', metaValues.author);
    }
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', metaValues.twitterCard);
    updateMetaTag('twitter:title', metaValues.title);
    updateMetaTag('twitter:description', metaValues.description);
    updateMetaTag('twitter:image', imageUrl);
    updateMetaTag('twitter:url', metaValues.url);
    
    // Nettoyage lors du démontage
    return () => {
      // Pas besoin de nettoyer car les balises seront remplacées par la prochaine page
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.image,
    metadata.type,
    metadata.url,
    metadata.siteName,
    metadata.locale,
    metadata.author,
    metadata.publishedTime,
    metadata.modifiedTime,
    metadata.twitterCard
  ]);
}

/**
 * Fonction d'aide pour mettre à jour ou créer une balise meta
 */
function updateMetaTag(name: string, content: string | undefined) {
  if (!content) return;
  
  // Vérifier s'il s'agit d'une propriété Open Graph ou d'un nom standard
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:') || name.startsWith('article:');
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

/**
 * Fonction d'aide pour convertir une URL relative en URL absolue
 */
function getAbsoluteUrl(url: string): string {
  if (!url) return '';
  
  // Si l'URL est déjà absolue, la retourner
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Sinon, ajouter l'origine
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Hook spécifique pour les pages générales du site
 */
export function usePageSEO(title: string, description?: string, image?: string) {
  const metadata: MetaData = {
    title,
    description: description || "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    image,
    type: "website",
  };
  
  useSEO(metadata);
}

/**
 * Hook spécifique pour les articles
 */
export function useArticleSEO(title: string, description: string, image: string, publishedTime?: string) {
  const metadata: MetaData = {
    title,
    description: description.substring(0, 160),
    image,
    type: "article",
    publishedTime,
    twitterCard: "summary_large_image"
  };
  
  useSEO(metadata);
}

/**
 * Hook spécifique pour les podcasts
 */
export function usePodcastSEO(title: string, description: string, image: string) {
  const metadata: MetaData = {
    title,
    description: description.substring(0, 160),
    image,
    type: "article", // On utilise "article" pour les podcasts
    twitterCard: "summary_large_image"
  };
  
  useSEO(metadata);
}

