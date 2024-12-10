import Parser from 'rss-parser';
import { useQuery } from '@tanstack/react-query';

const parser = new Parser();
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
  const feed = await parser.parseURL(RSS_URL);
  return feed.items as PodcastEpisode[];
};

export const usePodcastFeed = () => {
  return useQuery({
    queryKey: ['podcastFeed'],
    queryFn: fetchPodcastFeed,
  });
};