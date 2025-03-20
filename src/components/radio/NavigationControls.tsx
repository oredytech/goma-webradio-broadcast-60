
import { useState, useEffect } from 'react';
import { SkipBack, SkipForward } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { findEpisodeBySlug, getPodcastSlug } from '@/utils/podcastUtils';
import PlayPauseButton from './PlayPauseButton';

interface NavigationControlsProps {
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  isPlaying?: boolean;
}

const NavigationControls = ({ 
  currentAudio, 
  setCurrentAudio, 
  setIsPlaying,
  isPlaying: globalIsPlaying
}: NavigationControlsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: podcastData } = usePodcastFeed();
  const isPodcastRoute = location.pathname.includes('/podcast/');
  
  const [isLoading, setIsLoading] = useState(false);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const isPlaying = globalIsPlaying !== undefined ? globalIsPlaying : localIsPlaying;
  
  useEffect(() => {
    if (globalIsPlaying !== undefined) {
      setLocalIsPlaying(globalIsPlaying);
    }
  }, [globalIsPlaying]);
  
  const handleTogglePlay = () => {
    const newPlayState = !isPlaying;
    setLocalIsPlaying(newPlayState);
    setIsPlaying?.(newPlayState);
  };

  const handlePrevEpisode = () => {
    if (!isPodcastRoute || !podcastData) return;
    
    const currentSlug = location.pathname.split('/podcast/')[1];
    const episodes = podcastData.allEpisodes;
    const { episode, index } = findEpisodeBySlug(episodes, currentSlug);
    
    if (episode && index > 0) {
      const prevEpisode = episodes[index - 1];
      const slug = getPodcastSlug(prevEpisode.title);
      navigate(`/podcast/${slug}`);
      
      setCurrentAudio?.(prevEpisode.enclosure.url);
      setIsPlaying?.(true);
      setLocalIsPlaying(true);
    }
  };

  const handleNextEpisode = () => {
    if (!isPodcastRoute || !podcastData) return;
    
    const currentSlug = location.pathname.split('/podcast/')[1];
    const episodes = podcastData.allEpisodes;
    const { episode, index } = findEpisodeBySlug(episodes, currentSlug);
    
    if (episode && index < episodes.length - 1) {
      const nextEpisode = episodes[index + 1];
      const slug = getPodcastSlug(nextEpisode.title);
      navigate(`/podcast/${slug}`);
      
      setCurrentAudio?.(nextEpisode.enclosure.url);
      setIsPlaying?.(true);
      setLocalIsPlaying(true);
    }
  };

  const canNavigate = isPodcastRoute && Boolean(podcastData);
  
  let hasPrevious = false;
  let hasNext = false;
  
  if (canNavigate && podcastData) {
    const currentSlug = location.pathname.split('/podcast/')[1];
    const { index } = findEpisodeBySlug(podcastData.allEpisodes, currentSlug);
    
    hasPrevious = index > 0;
    hasNext = index !== -1 && index < podcastData.allEpisodes.length - 1;
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost" 
        size="icon"
        onClick={handlePrevEpisode}
        disabled={!hasPrevious}
        className="hover:bg-primary/20"
      >
        <SkipBack className="h-5 w-5 text-white" />
      </Button>
      
      <PlayPauseButton 
        isPlaying={isPlaying} 
        isLoading={isLoading} 
        togglePlay={handleTogglePlay} 
      />
      
      <Button
        variant="ghost" 
        size="icon"
        onClick={handleNextEpisode}
        disabled={!hasNext}
        className="hover:bg-primary/20"
      >
        <SkipForward className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default NavigationControls;
