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

// 🚫 Mode EXTRÊME : no cache, no store, no rien.
// 👉 On ajoute un timestamp pour forcer une URL unique à chaque appel
const fetchArticles = async (): Promise<WordPressArticle[]> => {
  const timestamp = Date.now(); // clé anti-cache

  const response = await fetch(
    `https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30&orderby=date&order=desc&_=${timestamp}`,
    {
      method: "GET",
      cache: "no-store", // empêche le navigateur de cacher
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
};

// ⚡ Mode extrême pour React Query : nouvelle clé à CHAQUE rendu
export const useWordpressArticles = () => {
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles", Date.now()], // invalide le cache automatiquement
    queryFn: fetchArticles,
    cacheTime: 0, // React Query ne garde rien en mémoire
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    refetchInterval: 10000, // Optionnel : refetch toutes les 10 secondes
  });
};

export type { WordPressArticle };
