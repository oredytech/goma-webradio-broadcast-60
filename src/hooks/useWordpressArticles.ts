
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
    console.log("Début de la récupération des articles WordPress");
    // Utiliser un proxy CORS pour éviter les problèmes de CORS sur Netlify
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
    
    console.log("Envoi de la requête au proxy CORS");
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    console.log("Réponse reçue, analyse du JSON");
    const data = await response.json();
    console.log("Articles récupérés avec succès:", data.length);
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
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
