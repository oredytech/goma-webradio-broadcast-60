import { useMultiSourceArticles, WordPressArticle } from "@/hooks/useMultiSourceArticles";

export interface UnifiedArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  source: 'wordpress';
  sourceId: number | string;
  link?: string;
  _embedded?: WordPressArticle['_embedded'];
}

export const useAllArticles = () => {
  const wordpressResults = useMultiSourceArticles();

  const isLoading = wordpressResults.some((result) => result.isLoading);
  const allFailed = wordpressResults.every((result) => result.isError);
  const isError = allFailed && !isLoading;

  const allArticles: UnifiedArticle[] = [];

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

  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    articles: allArticles,
    isLoading,
    isError,
  };
};
