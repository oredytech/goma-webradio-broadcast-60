
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

  // Check if this specific episode is currently playing
  const isThisEpisodePlaying = currentAudio === episode.enclosure.url && isPlaying;

  useEffect(() => {
    // Reset loading state when audio source changes or play state changes
    if (currentAudio === episode.enclosure.url) {
      setLoadingAudio(false);
    }
  }, [currentAudio, isPlaying, episode.enclosure.url]);

  const handlePlay = () => {
    if (currentAudio === episode.enclosure.url) {
      // Just toggle play/pause state without changing source
      setIsPlaying(!isPlaying);
    } else {
      // Load and play new audio source
      setLoadingAudio(true);
      setCurrentAudio(episode.enclosure.url);
      setIsPlaying(true);
    }
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
        {loadingAudio && currentAudio === episode.enclosure.url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-md"></div>
            <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
          </div>
        )}
        <Button
          onClick={handlePlay}
          className="group relative z-10"
          variant="default"
          size="lg"
          disabled={loadingAudio && currentAudio === episode.enclosure.url}
        >
          {isThisEpisodePlaying ? (
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
