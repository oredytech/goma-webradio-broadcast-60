
import React from 'react';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PodcastHeaderProps {
  episode: PodcastEpisode;
  onPlayClick: () => void;
}

const PodcastHeader = ({ episode, onPlayClick }: PodcastHeaderProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Podcast image failed to load:", episode.itunes?.image);
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return null; // Returning null to completely remove the component's rendering
};

export default PodcastHeader;
