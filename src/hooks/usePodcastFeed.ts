import { useQuery } from '@tanstack/react-query';

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

const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const RSS_URL = "https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss";

const fetchPodcastFeed = async (): Promise<PodcastEpisode[]> => {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
    const xmlText = await response.text();
    
    // Parse XML to DOM
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    // Extract episodes
    const items = xmlDoc.querySelectorAll("item");
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

    return episodes;
  } catch (error) {
    console.error("Error fetching podcast feed:", error);
    throw error;
  }
};

export const usePodcastFeed = () => {
  return useQuery({
    queryKey: ['podcastFeed'],
    queryFn: fetchPodcastFeed,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3
  });
};