
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { findEpisodeBySlug, findEpisodeById, getPodcastSlug } from '@/utils/podcastUtils';

export const useEpisodeFinder = () => {
  const { episodeId, slug } = useParams<{ episodeId?: string; slug?: string }>();
  const navigate = useNavigate();
  const { data: podcastData, isLoading } = usePodcastFeed();
  
  let foundEpisode = null;
  let foundIndex = -1;
  
  if (podcastData && !isLoading) {
    const episodes = podcastData.allEpisodes;
    
    if (episodeId && slug) {
      const result = findEpisodeById(episodes, episodeId);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        navigate(`/podcast/${generatedSlug}`, { replace: true });
      }
    } 
    else if (episodeId && !slug) {
      if (/^\d+$/.test(episodeId)) {
        const result = findEpisodeById(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      } else {
        const result = findEpisodeBySlug(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          if (episodeId !== generatedSlug) {
            navigate(`/podcast/${generatedSlug}`, { replace: true });
          }
        }
      }
    }
    else if (slug && !episodeId) {
      const result = findEpisodeBySlug(episodes, slug);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        if (slug !== generatedSlug) {
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      }
    }
  }

  return {
    podcastData,
    isLoading,
    foundEpisode,
    foundIndex
  };
};
