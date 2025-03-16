
import React from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';

interface PodcastPlayButtonProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  currentAudio: string | null;
  loadingEpisode: string | null;
  onPlay: (episode: PodcastEpisode) => void;
}

const PodcastPlayButton = ({
  episode,
  isPlaying,
  currentAudio,
  loadingEpisode,
  onPlay
}: PodcastPlayButtonProps) => {
  // Check if the audio URL is valid
  const hasValidUrl = Boolean(episode.enclosure?.url && episode.enclosure.url.startsWith('http'));
  
  // Verification si l'épisode actuel est en lecture
  const isCurrentlyPlaying = currentAudio && isPlaying && 
    (currentAudio === episode.enclosure?.url || 
    currentAudio.startsWith(episode.enclosure?.url || ''));
  
  const isCurrentlyLoading = loadingEpisode === episode.enclosure?.url;
  
  // Gérer le clic sur le bouton avec une vérification supplémentaire
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasValidUrl) return;
    
    onPlay(episode);
  };
  
  return (
    <div className="relative flex-1">
      {isCurrentlyLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
          <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
        </div>
      )}
      <Button
        onClick={handleClick}
        className="w-full group relative z-10"
        variant={isCurrentlyPlaying ? "secondary" : "default"}
        disabled={isCurrentlyLoading || !hasValidUrl}
      >
        {isCurrentlyPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            En lecture
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Écouter
          </>
        )}
      </Button>
    </div>
  );
};

export default PodcastPlayButton;
