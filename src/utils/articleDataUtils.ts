
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import { TelegramArticle } from "@/services/telegram";
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
 * Extracts standardized data from different article types
 */
export const extractArticleData = (
  article: WordPressArticle | TelegramArticle | null,
  articleSource: ArticleSource
): ArticleData | null => {
  if (!article) return null;

  if (articleSource === "wordpress") {
    const wpArticle = article as WordPressArticle;
    return {
      title: decodeHtmlTitle(wpArticle.title.rendered),
      content: wpArticle.content.rendered,
      featuredImageUrl: getFeaturedImageUrl(wpArticle),
      description: decodeHtmlTitle(wpArticle.excerpt.rendered),
      publishedDate: wpArticle.date,
    };
  } else {
    const telegramArticle = article as TelegramArticle;
    return {
      title: telegramArticle.title || "Sans titre",
      content: telegramArticle.content,
      featuredImageUrl: telegramArticle.featuredImage || '/GOWERA__3_-removebg-preview.png',
      description: telegramArticle.excerpt,
      publishedDate: telegramArticle.date,
    };
  }
};
