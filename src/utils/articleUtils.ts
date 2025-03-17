
import { WordPressArticle as SingleSourceArticle } from "@/hooks/useWordpressArticles";
import { WordPressArticle as MultiSourceArticle } from "@/hooks/useMultiSourceArticles";

// Type that accepts both article types
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
  date?: string; // Added date as optional property
};

export const getArticleSlug = (article: AnyWordPressArticle): string => {
  const decodedTitle = new DOMParser().parseFromString(
    article.title.rendered, 'text/html'
  ).body.textContent || article.title.rendered;
  
  return decodedTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

export const decodeHtmlTitle = (title: string): string => {
  return new DOMParser().parseFromString(title, 'text/html').body.textContent || title;
};

export const getFeaturedImageUrl = (article: AnyWordPressArticle): string => {
  return article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/GOWERA__3_-removebg-preview.png';
};
