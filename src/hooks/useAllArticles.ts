import { useQuery } from "@tanstack/react-query";

interface WordPressArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  slug: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    author?: Array<{
      name?: string;
      avatar_urls?: { [key: string]: string };
      description?: string;
      url?: string;
    }>;
  };
  link: string;
  date: string;
}

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

const fetchArticles = async (): Promise<WordPressArticle[]> => {
  const response = await fetch(
    "https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30&orderby=date&order=desc",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
};

export const useAllArticles = () => {
  const { data: articles, isLoading, isError } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 120000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

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
