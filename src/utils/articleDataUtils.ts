
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import { ArticleSource } from "@/hooks/useArticleFinder";
import { decodeHtmlTitle, getFeaturedImageUrl } from "@/utils/articleUtils";

interface ArticleData {
  title: string;
  content: string;
  featuredImageUrl: string;
  description: string;
  publishedDate: string;
}

/**
 * Extracts standardized data from WordPress articles
 */
export const extractArticleData = (
  article: WordPressArticle | null,
  articleSource: ArticleSource
): ArticleData | null => {
  if (!article) return null;

  const wpArticle = article as WordPressArticle;
  return {
    title: decodeHtmlTitle(wpArticle.title.rendered),
    content: wpArticle.content.rendered,
    featuredImageUrl: getFeaturedImageUrl(wpArticle),
    description: decodeHtmlTitle(wpArticle.excerpt.rendered),
    publishedDate: wpArticle.date,
  };
};
