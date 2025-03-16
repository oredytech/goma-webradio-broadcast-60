
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug } from '@/utils/podcastUtils';

interface PodcastActionsProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastActions = ({
  episode,
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastActionsProps) => {
  const { toast } = useToast();
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackPositionRef = useRef<number>(0);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = () => {
    if (currentAudio === episode.enclosure.url) {
      // Toggle play/pause without resetting audio
      setIsPlaying(!isPlaying);
      
      if (!isPlaying && audioRef.current) {
        // Resume from current position
        audioRef.current.play();
      } else if (audioRef.current) {
        // Pause and save current position
        playbackPositionRef.current = audioRef.current.currentTime;
        audioRef.current.pause();
      }
      return;
    }
    
    // New audio source
    setLoadingAudio(true);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    // Create new audio instance for the new source
    const audio = new Audio(episode.enclosure.url);
    audioRef.current = audio;
    
    audio.addEventListener('canplay', () => {
      setLoadingAudio(false);
      audio.play();
    });
    
    audio.addEventListener('timeupdate', () => {
      // Update the current playback position
      playbackPositionRef.current = audio.currentTime;
    });
  };

  const handleShare = () => {
    const slug = getPodcastSlug(episode.title);
    const shareUrl = `${window.location.origin}/podcast/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: episode.description,
        url: shareUrl,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative">
        {loadingAudio && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
            <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
          </div>
        )}
        <Button
          onClick={handlePlay}
          className="group relative z-10"
          variant="default"
          size="lg"
          disabled={loadingAudio}
        >
          {currentAudio === episode.enclosure.url && isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Écouter
            </>
          )}
        </Button>
      </div>
      
      <Button
        onClick={handleShare}
        variant="secondary"
        size="lg"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Partager
      </Button>
    </div>
  );
};

export default PodcastActions;
