
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
export const getTelegramArticleSlug = (article: TelegramArticle): string => {
  return article.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

/**
 * Normalizes a slug for comparison purposes
 * This helps with URL-unfriendly characters that might be in one slug but not the other
 */
export const normalizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove all non-alphanumeric characters
    .replace(/\s+/g, '')     // Remove all whitespace
    .trim();
};

/**
 * Checks if two slugs are similar (for fuzzy matching)
 */
export const areSlugsRelated = (slug1: string, slug2: string): boolean => {
  const normalized1 = normalizeSlug(slug1);
  const normalized2 = normalizeSlug(slug2);
  
  return normalized1.includes(normalized2) || 
         normalized2.includes(normalized1) || 
         normalized1 === normalized2;
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
