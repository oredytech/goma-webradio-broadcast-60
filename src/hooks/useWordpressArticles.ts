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
  const response = await fetch("https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30&orderby=date&order=desc", 
   {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
};

export const useWordpressArticles = () => {
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 0,                    // Jamais considéré comme frais
    refetchOnWindowFocus: true,      // Quand tu reviens sur l'onglet → reload
    refetchOnMount: true,            // Quand le composant apparaît → reload
    refetchOnReconnect: true,        // Si Internet revient → reload
  });
};

export type { WordPressArticle };
