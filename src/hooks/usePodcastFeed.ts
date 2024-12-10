import Parser from 'rss-parser';
import { useQuery } from '@tanstack/react-query';

const parser = new Parser({
  customFields: {
    item: ['itunes:image', 'itunes:duration'],
  },
});

// Using a CORS proxy to fetch the RSS feed
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const RSS_URL = 'https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss';

export interface PodcastEpisode {
  title: string;
  description: string;
  pubDate: string;
  enclosure: {
    url: string;
    type: string;
  };
  itunes: {
    image?: string;
    duration?: string;
  };
}

const fetchPodcastFeed = async () => {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const xmlText = await response.text();
    const feed = await parser.parseString(xmlText);
    return feed.items as PodcastEpisode[];
  } catch (error) {
    console.error('Error fetching podcast feed:', error);
    throw error;
  }
};

export const usePodcastFeed = () => {
  return useQuery({
    queryKey: ['podcastFeed'],
    queryFn: fetchPodcastFeed,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};