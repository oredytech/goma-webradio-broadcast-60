
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
  feedSource?: string; // Identify which feed this episode comes from
}

export interface PodcastFeedResult {
  allEpisodes: PodcastEpisode[];
  feedEpisodes: {
    [key: string]: {
      name: string;
      episodes: PodcastEpisode[];
    }
  }
}

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// Define our podcast feed sources
const PODCAST_FEEDS = [
  {
    id: "feed1",
    name: "REPORTAGES",
    url: "https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss"
  },
  {
    id: "feed2",
    name: "APPREND LE SWAHILI",
    url: "https://podcast.zenomedia.com/api/public/podcasts/dccffad2-6a72-41f0-b115-499b7a4bf255/rss"
  }
];

const fetchPodcastFeed = async (feedUrl: string, feedName: string): Promise<PodcastEpisode[]> => {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl));
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
        },
        feedSource: feedName
      };
    });

    return episodes;
  } catch (error) {
    console.error(`Error fetching podcast feed ${feedName}:`, error);
    throw error;
  }
};

const fetchAllPodcastFeeds = async (): Promise<PodcastFeedResult> => {
  try {
    // Fetch all feeds in parallel
    const feedPromises = PODCAST_FEEDS.map(feed => 
      fetchPodcastFeed(feed.url, feed.name).then(episodes => ({ 
        id: feed.id, 
        name: feed.name, 
        episodes 
      }))
    );
    
    const results = await Promise.all(feedPromises);
    
    // Create feedEpisodes object mapping feed ids to their episodes
    const feedEpisodes: {[key: string]: {name: string, episodes: PodcastEpisode[]}} = {};
    results.forEach(result => {
      feedEpisodes[result.id] = {
        name: result.name,
        episodes: result.episodes.sort((a, b) => {
          const dateA = new Date(a.pubDate).getTime();
          const dateB = new Date(b.pubDate).getTime();
          return dateB - dateA;
        })
      };
    });
    
    // Combine all episodes into a single array for backward compatibility
    const allEpisodes = results
      .flatMap(result => result.episodes)
      .sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });
    
    return { allEpisodes, feedEpisodes };
  } catch (error) {
    console.error("Error fetching podcast feeds:", error);
    throw error;
  }
};

export const usePodcastFeed = () => {
  return useQuery({
    queryKey: ['podcastFeeds'],
    queryFn: fetchAllPodcastFeeds,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3
  });
};
