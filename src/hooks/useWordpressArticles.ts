import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
  const { data, error } = await supabase.functions.invoke<WordPressArticle[]>("wp-proxy", {
    body: { type: "list", perPage: 30 },
  });
  if (error) throw error;
  return data as WordPressArticle[];
};

export const useWordpressArticles = () => {
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  });
};

export type { WordPressArticle };
