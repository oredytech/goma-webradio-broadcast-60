
import { useEffect } from 'react';
import { updateMetaTags, MetaData, getAbsoluteUrl } from '@/utils/metaService';

/**
 * Hook for managing SEO and social sharing meta tags
 * @param metadata The metadata to set for the current page
 */
export function useSEO(metadata: MetaData) {
  useEffect(() => {
    // Ensure image has absolute URL
    const updatedMetadata = {
      ...metadata,
      image: metadata.image ? getAbsoluteUrl(metadata.image) : undefined
    };
    
    // Update meta tags when the component mounts or metadata changes
    updateMetaTags(updatedMetadata);
    
    // Reset meta tags when the component unmounts
    return () => {
      // Only reset if we're navigating away from the page completely
      // This prevents flashing of default meta tags during navigation
      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          updateMetaTags({
            title: "GOMA WEBRADIO",
            description: "La voix de Goma - Actualités, Podcasts et Émissions en direct",
            image: "/GOWERA__3_-removebg-preview.png",
            type: "website",
            url: window.location.origin
          });
        }
      }, 0);
    };
  }, [metadata]);
}

/**
 * Generate SEO metadata for a page
 */
export function usePageSEO(title: string, description?: string, image?: string) {
  const metadata: MetaData = {
    title,
    description: description || "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    image: image || "/GOWERA__3_-removebg-preview.png",
    type: "website",
    url: window.location.href,
  };
  
  useSEO(metadata);
  
  return metadata;
}

/**
 * Generate SEO metadata for an article
 */
export function useArticleSEO(title: string, description: string, image: string) {
  const metadata: MetaData = {
    title,
    description: description.substring(0, 160),
    image,
    type: "article",
    url: window.location.href,
  };
  
  useSEO(metadata);
  
  return metadata;
}

/**
 * Generate SEO metadata for a podcast
 */
export function usePodcastSEO(title: string, description: string, image: string) {
  const metadata: MetaData = {
    title,
    description: description.substring(0, 160),
    image,
    type: "article", // Using "article" type for podcasts as they are content pieces
    url: window.location.href,
  };
  
  useSEO(metadata);
  
  return metadata;
}
