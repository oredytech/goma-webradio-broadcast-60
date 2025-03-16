
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
    console.log("Fetching WordPress articles...");
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
    
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache' // Don't use browser cache - always fetch fresh content
    });
    
    if (!response.ok) {
      console.error(`Network response error: ${response.status}`);
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} articles`);
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
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
