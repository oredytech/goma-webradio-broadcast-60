
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

    // Réglage des métadonnées pour MediaSession API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: 'Goma Webradio',
        album: 'LE REPORTAGE',
        artwork: [
          { src: episode.itunes?.image || '/placeholder.svg', sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }

    // Définir un délai de sécurité pour annuler le chargement si trop long
    const loadingTimeout = setTimeout(() => {
      if (loadingEpisode === episode.enclosure.url) {
        setLoadingEpisode(null);
        
        toast({
          title: "Chargement lent",
          description: "Le chargement prend plus de temps que prévu. Vérifiez votre connexion.",
          variant: "destructive",
        });
      }
    }, 30000); // 30 secondes timeout (augmenté pour les connexions lentes)

    // Ajouter un timestamp à l'URL pour éviter le cache
    let audioUrl = episode.enclosure.url;
    if (audioUrl.indexOf('?') === -1) {
      audioUrl = audioUrl + '?t=' + new Date().getTime();
    }
    
    // Mise à jour directe pour éviter l'état de chargement persistant
    setCurrentAudio(audioUrl);
    setIsPlaying(true);
    
    // Annuler l'état de chargement après un court délai pour garantir que le lecteur a eu le temps de changer d'état
    setTimeout(() => {
      setLoadingEpisode(null);
    }, 3000);
    
    // Nettoyer le timeout si le composant est démonté
    return () => {
      clearTimeout(loadingTimeout);
    };
  };

  return {
    loadingEpisode,
    handlePlayEpisode
  };
};
