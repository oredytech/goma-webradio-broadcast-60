import { WordPressArticle as SingleSourceArticle } from "@/hooks/useWordpressArticles";
import { WordPressArticle as MultiSourceArticle } from "@/hooks/useMultiSourceArticles";
import { TelegramArticle } from "@/services/telegramService";

// Type that accepts WordPress article types
type AnyWordPressArticle = {
  id: number;
  title: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  date?: string;
};

/**
 * Generates a slug from a WordPress article title
 */
export const getArticleSlug = (article: AnyWordPressArticle): string => {
  const decodedTitle = new DOMParser().parseFromString(
    article.title.rendered, 'text/html'
  ).body.textContent || article.title.rendered;
  
  return decodedTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

/**
 * Generates a slug from a Telegram article title
 */
export const getTelegramArticleSlug = (article: any): string => {
  const id = article.id;
  const title = article.title || "sans-titre";
  return `${id}-${normalizeSlug(title)}`;
};

/**
 * Normalizes a slug for comparison purposes
 * This helps with URL-unfriendly characters that might be in one slug but not the other
 */
export const normalizeSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Checks if two slugs are similar (for fuzzy matching)
 */
export const areSlugsRelated = (slug1: string, slug2: string): boolean => {
  // Extraire l'ID si présent
  const idMatch1 = slug1.match(/^(\d+)-/);
  const idMatch2 = slug2.match(/^(\d+)-/);
  
  // Si les deux slugs ont des IDs et qu'ils correspondent
  if (idMatch1 && idMatch2 && idMatch1[1] === idMatch2[1]) {
    return true;
  }
  
  // Normaliser les slugs pour une comparaison plus souple
  const normalizedSlug1 = normalizeSlug(slug1);
  const normalizedSlug2 = normalizeSlug(slug2);
  
  // Vérifier si l'un contient l'autre ou s'ils sont similaires
  return normalizedSlug1.includes(normalizedSlug2) || 
         normalizedSlug2.includes(normalizedSlug1) ||
         normalizedSlug1 === normalizedSlug2;
};

/**
 * Decodes HTML entities in a title
 */
export const decodeHtmlTitle = (title: string): string => {
  return new DOMParser().parseFromString(title, 'text/html').body.textContent || title;
};

/**
 * Gets the featured image URL from an article
 */
export const getFeaturedImageUrl = (article: AnyWordPressArticle): string => {
  return article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/GOWERA__3_-removebg-preview.png';
};
