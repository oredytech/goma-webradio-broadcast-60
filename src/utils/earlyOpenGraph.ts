/**
 * Utility to ensure Open Graph tags are loaded as early as possible
 * This helps ensure social media platforms can properly crawl the page
 * @deprecated Utilisez le hook useSEO à la place
 */

// Default values for important Open Graph tags
const DEFAULT_OG_DATA = {
  title: "GOMA WEBRADIO",
  description: "La voix de Goma - Actualités, Podcasts et Émissions en direct",
  image: "/GOWERA__3_-removebg-preview.png",
  url: typeof window !== 'undefined' ? window.location.origin : '',
  siteName: "GOMA WEBRADIO",
  locale: "fr_FR",
  type: "website"
};

/**
 * Initialize Open Graph tags as early as possible in the page lifecycle
 * @deprecated Utilisez le hook useSEO à la place
 */
export function initEarlyOpenGraph() {
  console.warn("initEarlyOpenGraph est déprécié, utilisez le hook useSEO à la place");
  
  if (typeof document === 'undefined') return;
  
  // Set default Open Graph tags
  setOpenGraphTag('og:title', DEFAULT_OG_DATA.title);
  setOpenGraphTag('og:description', DEFAULT_OG_DATA.description);
  setOpenGraphTag('og:image', getAbsoluteUrl(DEFAULT_OG_DATA.image));
  setOpenGraphTag('og:url', DEFAULT_OG_DATA.url);
  setOpenGraphTag('og:site_name', DEFAULT_OG_DATA.siteName);
  setOpenGraphTag('og:locale', DEFAULT_OG_DATA.locale);
  setOpenGraphTag('og:type', DEFAULT_OG_DATA.type);
  
  // Set Twitter Card tags
  setTwitterTag('twitter:card', 'summary_large_image');
  setTwitterTag('twitter:title', DEFAULT_OG_DATA.title);
  setTwitterTag('twitter:description', DEFAULT_OG_DATA.description);
  setTwitterTag('twitter:image', getAbsoluteUrl(DEFAULT_OG_DATA.image));
}

// Helper function to set Open Graph tags
function setOpenGraphTag(property: string, content: string) {
  if (!content) return;
  
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

// Helper function to set Twitter Card tags
function setTwitterTag(name: string, content: string) {
  if (!content) return;
  
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

// Helper function to ensure URLs are absolute
function getAbsoluteUrl(url: string): string {
  if (!url) return '';
  
  // If the URL is already absolute, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the origin
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Call this function as early as possible
if (typeof document !== 'undefined') {
  // Execute immediately if document is available
  initEarlyOpenGraph();
  
  // Also execute on DOMContentLoaded to ensure it runs
  document.addEventListener('DOMContentLoaded', initEarlyOpenGraph);
}

export default initEarlyOpenGraph;
