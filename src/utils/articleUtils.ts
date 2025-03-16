
import { WordPressArticle } from "@/hooks/useWordpressArticles";

export const getArticleSlug = (article: WordPressArticle): string => {
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

export const getFeaturedImageUrl = (article: WordPressArticle): string => {
  return article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/GOWERA__3_-removebg-preview.png';
};
