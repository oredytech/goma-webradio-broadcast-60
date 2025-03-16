
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface PodcastEpisode {
  title: string;
  description?: string;
  pubDate: string;
  enclosure: {
    url: string;
    type: string;
  };
  itunes?: {
    image?: string;
    duration?: string;
  };
}

// Utilisation d'un proxy CORS plus fiable
const CORS_PROXY = "https://corsproxy.io/?";
// URL RSS d'origine reste la même
const RSS_URL = "https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss";

const fetchPodcastFeed = async (): Promise<PodcastEpisode[]> => {
  try {
    console.log("Fetching podcast feed...");
    const encodedUrl = encodeURIComponent(RSS_URL);
    const response = await fetch(`${CORS_PROXY}${encodedUrl}`, {
      cache: 'no-cache',
      headers: {
        'Accept': 'text/xml, application/xml, application/rss+xml'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch podcast feed: ${response.status}`);
      throw new Error(`Failed to fetch podcast feed: ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    // Vérification si la réponse est vide
    if (!xmlText || xmlText.trim() === '') {
      console.error("Empty XML response");
      throw new Error("Empty XML response");
    }
    
    console.log("Received XML response length:", xmlText.length);
    
    // Parse XML to DOM
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    // Check for parser errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.error("Failed to parse podcast XML feed:", parserError.textContent);
      throw new Error("Failed to parse podcast XML feed");
    }
    
    // Extract episodes
    const items = xmlDoc.querySelectorAll("item");
    
    if (items.length === 0) {
      console.log("No podcast episodes found in feed");
      return [];
    }
    
    const episodes: PodcastEpisode[] = Array.from(items).map((item) => {
      const title = item.querySelector("title")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const enclosureElement = item.querySelector("enclosure");
      const itunesImage = item.querySelector("itunes\\:image, image")?.getAttribute("href");
      const itunesDuration = item.querySelector("itunes\\:duration")?.textContent;

      return {
        title,
        description,
        pubDate,
        enclosure: {
          url: enclosureElement?.getAttribute("url") || "",
          type: enclosureElement?.getAttribute("type") || "audio/mpeg"
        },
        itunes: {
          image: itunesImage,
          duration: itunesDuration
        }
      };
    });

    console.log(`Successfully fetched ${episodes.length} podcast episodes`);
    return episodes;
  } catch (error) {
    console.error("Error fetching podcast feed:", error);
    throw error;
  }
};

export const usePodcastFeed = () => {
  const { toast } = useToast();
  
  return useQuery<PodcastEpisode[]>({
    queryKey: ['podcastFeed'],
    queryFn: fetchPodcastFeed,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes only
    gcTime: 10 * 60 * 1000, // Garbage collection after 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    meta: {
      onError: (error: Error) => {
        console.error("Podcast feed error:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les podcasts. Veuillez réessayer ultérieurement.",
          variant: "destructive",
        });
      }
    }
  });
};
