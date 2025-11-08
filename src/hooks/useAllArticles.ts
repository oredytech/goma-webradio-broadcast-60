import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";

export interface UnifiedArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  source: 'wordpress';
  sourceId: number;
  link?: string;
  _embedded?: WordPressArticle['_embedded'];
}

export const useAllArticles = () => {
  const { data: articles, isLoading, isError } = useWordpressArticles();

  const allArticles: UnifiedArticle[] = (articles || []).map((article) => ({
    id: `wp-${article.id}`,
    title: article.title.rendered,
    excerpt: article.excerpt.rendered,
    content: article.content.rendered,
    date: article.date,
    featuredImage: article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
    source: 'wordpress' as const,
    sourceId: article.id,
    link: article.link,
    _embedded: article._embedded,
  }));

  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    articles: allArticles,
    isLoading,
    isError,
  };
};
