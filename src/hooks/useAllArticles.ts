import { useMultiSourceArticles, WordPressArticle } from "@/hooks/useMultiSourceArticles";
import { useTelegramArticles } from "@/hooks/useTelegramArticles";
import { TelegramArticle } from "@/services/telegram";

export interface UnifiedArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  source: 'wordpress' | 'telegram';
  sourceId: number | string;
  link?: string;
  _embedded?: WordPressArticle['_embedded'];
}

export const useAllArticles = () => {
  const wordpressResults = useMultiSourceArticles();
  const { data: telegramArticles, isLoading: isLoadingTelegram } = useTelegramArticles();

  const isLoading = wordpressResults.some((result) => result.isLoading) || isLoadingTelegram;
  // Only show error if ALL sources fail (not just one)
  const allFailed = wordpressResults.every((result) => result.isError) && !telegramArticles;
  const isError = allFailed && !isLoading;

  // Combine and normalize all articles
  const allArticles: UnifiedArticle[] = [];

  // Add WordPress articles
  wordpressResults.forEach((result) => {
    if (result.data) {
      (result.data as WordPressArticle[]).forEach((article) => {
        allArticles.push({
          id: `wp-${article.id}`,
          title: article.title.rendered,
          excerpt: article.excerpt.rendered,
          content: article.content.rendered,
          date: article.date,
          featuredImage: article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
          source: 'wordpress',
          sourceId: article.id,
          link: article.link,
          _embedded: article._embedded,
        });
      });
    }
  });

  // Add Telegram articles
  if (telegramArticles) {
    telegramArticles.forEach((article) => {
      allArticles.push({
        id: `tg-${article.id}`,
        title: article.title || "Sans titre",
        excerpt: article.excerpt,
        content: article.content,
        date: article.date,
        featuredImage: article.featuredImage || null,
        source: 'telegram',
        sourceId: article.id,
      });
    });
  }

  // Sort by date (newest first)
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    articles: allArticles,
    isLoading,
    isError,
  };
};
