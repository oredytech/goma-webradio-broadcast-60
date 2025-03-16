
import { useQueries } from "@tanstack/react-query";

interface WordPressArticle {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

const sources = [
  {
    id: "totalementactus",
    url: "https://totalementactus.net/wp-json/wp/v2/posts",
    name: "Totalement Actus"
  }
];

const fetchArticles = async (source: string) => {
  try {
    // Utiliser un proxy CORS pour éviter les problèmes de CORS sur Netlify
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent(`${source}?_embed&per_page=30`);
    
    const response = await fetch(`${proxyUrl}${apiUrl}`);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Articles de ${source} récupérés avec succès:`, data.length);
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles de ${source}:`, error);
    throw error;
  }
};

export const useMultiSourceArticles = () => {
  return useQueries({
    queries: sources.map((source) => ({
      queryKey: ["articles", source.id],
      queryFn: () => fetchArticles(source.url),
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    })),
  });
};

export type { WordPressArticle };
export { sources };
