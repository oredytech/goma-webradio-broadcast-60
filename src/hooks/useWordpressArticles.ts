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
  const response = await fetch("https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30", {
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
    staleTime: 5 * 60 * 1000,
  });
};

export type { WordPressArticle };
