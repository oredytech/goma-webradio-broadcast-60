
import { useState, useEffect } from 'react';
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

  // Clear any abandoned loading states when component unmounts
  useEffect(() => {
    return () => {
      if (loadingEpisode) {
        setLoadingEpisode(null);
      }
    };
  }, [loadingEpisode]);

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    // Validation check - ensure valid URL
    if (!episode.enclosure?.url || !episode.enclosure.url.startsWith('http')) {
      toast({
        title: "URL invalide",
        description: "L'URL de cet épisode n'est pas valide. Veuillez essayer un autre épisode.",
        variant: "destructive",
      });
      return;
    }

    // Toggle playback if already selected
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    
    // Set track and artist information for media session if provided
    if (setCurrentTrack) {
      setCurrentTrack(episode.title);
    }
    
    if (setCurrentArtist) {
      setCurrentArtist("Goma Webradio");
    }

    // Create a new audio element to preload content with comprehensive error handling
    const audio = new Audio();
    
    // Set up error handling first, before setting the source
    audio.onerror = () => {
      console.error("Audio playback error:", audio.error);
      
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire l'audio. Connexion perdue ou source non disponible.",
        variant: "destructive",
      });
      
      setLoadingEpisode(null);
      setIsPlaying(false);
    };
    
    // Handle successful loading
    audio.oncanplay = () => {
      setCurrentAudio(episode.enclosure.url);
      setIsPlaying(true);
      setLoadingEpisode(null);
    };
    
    // Handle timeouts for slow connections
    const loadingTimeout = setTimeout(() => {
      if (loadingEpisode === episode.enclosure.url) {
        setLoadingEpisode(null);
        
        toast({
          title: "Chargement lent",
          description: "Le chargement prend plus de temps que prévu. Vérifiez votre connexion.",
          variant: "destructive",
        });
      }
    }, 15000); // 15 seconds timeout
    
    // Use CORS proxy for better compatibility
    let audioUrl = episode.enclosure.url;
    
    // Set the source and attempt to load
    audio.crossOrigin = "anonymous";
    audio.src = audioUrl;
    audio.load();
    
    return () => {
      clearTimeout(loadingTimeout);
      audio.oncanplay = null;
      audio.onerror = null;
    };
  };

  return {
    loadingEpisode,
    handlePlayEpisode
  };
};
