
import { useNavigate } from 'react-router-dom';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug } from '@/utils/podcastUtils';

interface UseEpisodeNavigationProps {
  foundIndex: number;
  podcastData: any;
  setCurrentAudio: (url: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useEpisodeNavigation = ({
  foundIndex,
  podcastData,
  setCurrentAudio,
  setIsPlaying
}: UseEpisodeNavigationProps) => {
  const navigate = useNavigate();
  
  const hasPrevious = podcastData && foundIndex > 0;
  const hasNext = podcastData && foundIndex !== -1 && foundIndex < podcastData.allEpisodes.length - 1;

  const navigateToPreviousEpisode = () => {
    if (!podcastData || foundIndex <= 0) return;
    
    const previousEpisode = podcastData.allEpisodes[foundIndex - 1];
    if (previousEpisode) {
      const slug = getPodcastSlug(previousEpisode.title);
      navigate(`/podcast/${slug}`);
      
      // Automatically start playing the previous episode
      setCurrentAudio(previousEpisode.enclosure.url);
      setIsPlaying(true);
    }
  };

  const navigateToNextEpisode = () => {
    if (!podcastData || foundIndex === -1 || foundIndex >= podcastData.allEpisodes.length - 1) return;
    
    const nextEpisode = podcastData.allEpisodes[foundIndex + 1];
    if (nextEpisode) {
      const slug = getPodcastSlug(nextEpisode.title);
      navigate(`/podcast/${slug}`);
      
      // Automatically start playing the next episode
      setCurrentAudio(nextEpisode.enclosure.url);
      setIsPlaying(true);
    }
  };

  return {
    hasPrevious,
    hasNext,
    navigateToPreviousEpisode,
    navigateToNextEpisode
  };
};
