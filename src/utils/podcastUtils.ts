
import { PodcastEpisode } from "@/hooks/usePodcastFeed";

/**
 * Generate a slug from a podcast title
 */
export const getPodcastSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

/**
 * Find an episode by its slug
 */
export const findEpisodeBySlug = (
  episodes: PodcastEpisode[] | undefined,
  slug: string
): { episode: PodcastEpisode | null; index: number } => {
  if (!episodes) return { episode: null, index: -1 };
  
  const index = episodes.findIndex(ep => {
    const episodeSlug = getPodcastSlug(ep.title);
    
    return slug === episodeSlug || 
           slug.includes(episodeSlug) || 
           episodeSlug.includes(slug) ||
           ep.title.toLowerCase().includes(slug.toLowerCase());
  });
  
  if (index !== -1) {
    return { episode: episodes[index], index };
  }
  
  return { episode: null, index: -1 };
};

/**
 * Find an episode by its numeric ID
 */
export const findEpisodeById = (
  episodes: PodcastEpisode[] | undefined,
  id: string
): { episode: PodcastEpisode | null; index: number } => {
  if (!episodes) return { episode: null, index: -1 };
  
  const numericId = parseInt(id);
  if (isNaN(numericId) || numericId < 0 || numericId >= episodes.length) {
    return { episode: null, index: -1 };
  }
  
  return { episode: episodes[numericId], index: numericId };
};

/**
 * Strip HTML tags from text
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
