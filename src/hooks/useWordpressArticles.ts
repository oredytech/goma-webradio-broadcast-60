
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

// Liste de proxies CORS à essayer dans l'ordre
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://crossorigin.me/",
  "https://crosscors.shop/",
  "https://proxy.cors.sh/",
];

const fetchArticles = async () => {
  try {
    console.log("Fetching WordPress articles...");
    const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
    
    // Essayer chaque proxy dans l'ordre jusqu'à ce qu'un fonctionne
    let response = null;
    let error = null;
    
    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`Trying proxy: ${proxy}`);
        response = await fetch(`${proxy}${apiUrl}`, {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (response.ok) {
          break; // Si la requête réussit, sortir de la boucle
        }
      } catch (err) {
        error = err;
        console.warn(`Proxy ${proxy} failed:`, err);
        // Continuer avec le prochain proxy
      }
    }
    
    // Si aucun proxy n'a fonctionné
    if (!response || !response.ok) {
      console.error("All proxies failed to fetch WordPress articles");
      throw error || new Error("All proxies failed");
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} articles`);
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

// Fonction pour récupérer des articles statiques de secours au cas où tous les proxies échouent
const getFallbackArticles = (): WordPressArticle[] => {
  return [
    {
      id: 1,
      title: { rendered: "Contenu temporairement indisponible" },
      excerpt: { rendered: "<p>Nous rencontrons des difficultés techniques. Merci de réessayer ultérieurement.</p>" },
      content: { rendered: "<p>Contenu temporairement indisponible. Veuillez réessayer plus tard.</p>" },
      featured_media: 0,
      link: "#",
    },
  ];
};

export const useWordpressArticles = () => {
  const { toast } = useToast();
  
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes only
    gcTime: 10 * 60 * 1000, // Garbage collection after 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    refetchOnWindowFocus: false,
    placeholderData: getFallbackArticles, // Données de secours en cas d'échec
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching articles:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les articles. Veuillez réessayer ultérieurement.",
          variant: "destructive",
        });
      }
    }
  });
};
