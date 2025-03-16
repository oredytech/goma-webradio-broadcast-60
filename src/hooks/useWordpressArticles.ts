
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface WordPressArticle {
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
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  link: string;
}

const fetchArticles = async () => {
  try {
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
    
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'force-cache' // Utiliser le cache par défaut du navigateur
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    throw error;
  }
};

export const useWordpressArticles = () => {
  const { toast } = useToast();
  
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 15 * 60 * 1000, // Cache pendant 15 minutes
    gcTime: 30 * 60 * 1000, // Garbage collection après 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      onError: (error: Error) => {
        console.error("Erreur de récupération des articles:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les articles. Veuillez réessayer ultérieurement.",
          variant: "destructive",
        });
      }
    }
  });
};
