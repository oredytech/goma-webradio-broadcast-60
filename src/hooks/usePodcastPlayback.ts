
import { useState } from 'react';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { useToast } from '@/hooks/use-toast';

interface UsePodcastPlaybackProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
  setCurrentTrack?: (title: string) => void;
  setCurrentArtist?: (artist: string) => void;
}

export const usePodcastPlayback = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
  setCurrentTrack,
  setCurrentArtist,
}: UsePodcastPlaybackProps) => {
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    // Set track and artist information for media session if provided
    if (setCurrentTrack) {
      setCurrentTrack(episode.title);
    }
    
    if (setCurrentArtist) {
      setCurrentArtist("Goma Webradio");
    }

    // Create a new audio element to preload content, but with error handling
    const audio = new Audio();
    
    // Handle errors during loading
    audio.onerror = () => {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      setLoadingEpisode(null);
    };
    
    // Handle successful loading
    audio.oncanplay = () => {
      setLoadingEpisode(null);
    };
    
    // Set timeout to avoid infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (loadingEpisode === episode.enclosure.url) {
        setLoadingEpisode(null);
      }
    }, 10000);
    
    // Clean up timeout if component unmounts
    audio.src = episode.enclosure.url;
    audio.load();
    
    return () => clearTimeout(loadingTimeout);
  };

  return {
    loadingEpisode,
    handlePlayEpisode
  };
};
