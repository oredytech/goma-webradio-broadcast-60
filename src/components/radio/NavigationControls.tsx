
import { useState } from 'react';
import { SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { findEpisodeBySlug, getPodcastSlug } from '@/utils/podcastUtils';
import PlayPauseButton from './PlayPauseButton';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface NavigationControlsProps {
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
}

const NavigationControls = ({ 
  currentAudio, 
  setCurrentAudio, 
  setIsPlaying 
}: NavigationControlsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: podcastData } = usePodcastFeed();
  const isPodcastRoute = location.pathname.includes('/podcast/');
  
  // Update how we use useAudioPlayer - pass necessary props
  const { 
    isLoading, 
    togglePlay 
  } = useAudioPlayer({
    isPlaying: false, // This doesn't matter as we only need togglePlay and isLoading
    currentAudio,
    setCurrentAudio
  });

  // Add local state to track if this component's audio is playing
  // This is separate from the global isPlaying state managed in App.tsx
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  
  // Override the togglePlay function to update our local state
  const handleTogglePlay = () => {
    const newPlayState = !localIsPlaying;
    setLocalIsPlaying(newPlayState);
    // Also update global state if needed
    setIsPlaying?.(newPlayState);
    // Call the original toggle function
    togglePlay();
  };

  // Navigate to previous podcast episode
  const handlePrevEpisode = () => {
    if (!isPodcastRoute || !podcastData) return;
    
    const currentSlug = location.pathname.split('/podcast/')[1];
    const episodes = podcastData.allEpisodes;
    const { episode, index } = findEpisodeBySlug(episodes, currentSlug);
    
    if (episode && index > 0) {
      const prevEpisode = episodes[index - 1];
      const slug = getPodcastSlug(prevEpisode.title);
      navigate(`/podcast/${slug}`);
      
      // Start playing the previous episode
      setCurrentAudio?.(prevEpisode.enclosure.url);
      setIsPlaying?.(true);
      setLocalIsPlaying(true);
    }
  };

  // Navigate to next podcast episode
  const handleNextEpisode = () => {
    if (!isPodcastRoute || !podcastData) return;
    
    const currentSlug = location.pathname.split('/podcast/')[1];
    const episodes = podcastData.allEpisodes;
    const { episode, index } = findEpisodeBySlug(episodes, currentSlug);
    
    if (episode && index < episodes.length - 1) {
      const nextEpisode = episodes[index + 1];
      const slug = getPodcastSlug(nextEpisode.title);
      navigate(`/podcast/${slug}`);
      
      // Start playing the next episode
      setCurrentAudio?.(nextEpisode.enclosure.url);
      setIsPlaying?.(true);
      setLocalIsPlaying(true);
    }
  };

  // Check if navigation buttons should be enabled
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
        className="hover:bg-primary/20 hidden sm:flex"
      >
        <SkipBack className="h-5 w-5 text-white" />
      </Button>
      
      <PlayPauseButton 
        isPlaying={localIsPlaying} 
        isLoading={isLoading} 
        togglePlay={handleTogglePlay} 
      />
      
      <Button
        variant="ghost" 
        size="icon"
        onClick={handleNextEpisode}
        disabled={!hasNext}
        className="hover:bg-primary/20 hidden sm:flex"
      >
        <SkipForward className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default NavigationControls;
