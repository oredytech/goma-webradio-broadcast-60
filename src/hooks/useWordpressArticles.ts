import { useQuery } from "@tanstack/react-query";

interface WordPressArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
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

const fetchArticles = async (): Promise<WordPressArticle[]> => {
  const response = await fetch(
    "https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30&orderby=date&order=desc",
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
};

// 💎 Mode idéal : rapide + rafraîchissement automatique
export const useWordpressArticles = () => {
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 1000 * 15,          // 15 sec : frais = affichage rapide
    refetchInterval: 10000,        // refetch toutes les 10 sec → quasi instantané
    refetchOnWindowFocus: true,    // revient sur l’onglet = refresh
    refetchOnReconnect: true,
    refetchOnMount: false,         // évite le double-fetch inutile
  });
};

export type { WordPressArticle };
