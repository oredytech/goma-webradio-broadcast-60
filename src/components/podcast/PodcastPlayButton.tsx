
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
  return (
    <div className="relative flex-1">
      {loadingEpisode === episode.enclosure.url && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
          <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
        </div>
      )}
      <Button
        onClick={() => onPlay(episode)}
        className="w-full group relative z-10"
        variant={currentAudio === episode.enclosure.url && isPlaying ? "secondary" : "default"}
        disabled={loadingEpisode === episode.enclosure.url}
      >
        {currentAudio === episode.enclosure.url && isPlaying ? (
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
