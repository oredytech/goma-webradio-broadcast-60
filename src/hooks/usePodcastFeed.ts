import Parser from 'rss-parser';
import { useQuery } from '@tanstack/react-query';

// Configure parser for browser usage
const parser = new Parser({
  customFields: {
    item: [
      ['itunes:image', 'image'],
      ['itunes:duration', 'duration'],
      'description',
    ],
  },
  requestOptions: {
    // Disable XML parsing features that cause browser issues
    xml2js: {
      emptyTag: null,
      strict: false,
      explicitArray: false,
    }
  }
});

// Using a CORS proxy to fetch the RSS feed
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const RSS_URL = 'https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss';

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

const fetchPodcastFeed = async () => {
  try {
    console.log('Fetching podcast feed...');
    const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const xmlText = await response.text();
    console.log('XML received, parsing...');
    
    const feed = await parser.parseString(xmlText);
    console.log('Feed parsed:', feed);
    
    // Transform the feed items to match our PodcastEpisode interface
    const episodes = feed.items.map(item => ({
      title: item.title || '',
      description: item.description || item.contentSnippet || '',
      pubDate: item.pubDate || '',
      enclosure: {
        url: item.enclosure?.url || '',
        type: item.enclosure?.type || ''
      },
      itunes: {
        image: item['itunes:image'] || item.image || '',
        duration: item['itunes:duration'] || item.duration || ''
      }
    })) as PodcastEpisode[];
    
    console.log('Transformed episodes:', episodes);
    return episodes;
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