import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface WordPressArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link: string;
  date: string;
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
  featured_media?: number;
}

const sources = [
  {
    id: "gomawebradio",
    url: "wp-proxy", // via cloud function
    name: "Goma Webradio News",
  },
];

const fetchArticles = async (): Promise<WordPressArticle[]> => {
  const { data, error } = await supabase.functions.invoke<WordPressArticle[]>("wp-proxy", {
    body: { type: "list", perPage: 30 },
  });
  if (error) throw error;
  return data as WordPressArticle[];
};

export const useMultiSourceArticles = () => {
  return useQueries({
    queries: sources.map((source) => ({
      queryKey: ["articles", source.id],
      queryFn: () => fetchArticles(),
      staleTime: 5 * 60 * 1000,
    })),
  });
};

export type { WordPressArticle };
export { sources };
