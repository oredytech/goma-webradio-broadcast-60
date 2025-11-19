import { WordPressArticle } from "@/hooks/useWordpressArticles";

// Type that accepts WordPress article types
type AnyWordPressArticle = {
  id: number;
  title: {
    rendered: string;
  };
  slug?: string;
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
  // Si WordPress fournit déjà un slug, on l'utilise (c'est la source de vérité)
  if (article.slug) return article.slug;

  // Sinon on génère proprement à partir du titre
  const createSlugFromTitle = (title: string): string => {
    const decodedTitle = new DOMParser().parseFromString(title, 'text/html').body.textContent || title;

    // 1) Décomposer les caractères et enlever les diacritiques (ô -> o)
    const withoutDiacritics = decodedTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 2) Garder lettres (unicode) et chiffres, remplacer espaces par tirets, nettoyer tirets doublés
    const slug = withoutDiacritics
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // nécessite le flag 'u' (modern browsers/Node)
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return slug;
  };

  return createSlugFromTitle(article.title.rendered || '');
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
