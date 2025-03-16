
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAudioPlayerProps {
  currentAudio: string | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useAudioPlayer = ({ currentAudio, isPlaying, setIsPlaying }: UseAudioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      setIsLoading(true);
      setError(null);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsLoading(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Playback error:', err);
            setIsLoading(false);
            setError("Impossible de lire l'audio. Veuillez réessayer.");
            toast({
              title: "Erreur de lecture",
              description: "Impossible de lire l'audio. Veuillez réessayer.",
              variant: "destructive",
            });
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && currentAudio) {
      const newTime = (value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  // Effect to set up and manage audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      if (audio) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setError("Erreur de lecture audio. Veuillez réessayer.");
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [toast, setIsPlaying]);

  // Effect to handle audio source changes and playback state
  useEffect(() => {
    let currentSrc = "";
    
    if (audioRef.current) {
      currentSrc = audioRef.current.src;
      setError(null);
      
      // Si la source audio a changé, on charge la nouvelle source
      if (currentAudio && currentSrc !== currentAudio) {
        setIsLoading(true);
        audioRef.current.src = currentAudio;
        // Utiliser la propriété crossOrigin pour éviter des problèmes CORS
        audioRef.current.crossOrigin = "anonymous";
      } else if (!currentAudio && currentSrc !== "https://stream.zeno.fm/4d61wprrp7zuv") {
        // Si pas d'audio spécifique, on revient à la radio en direct
        setIsLoading(true);
        audioRef.current.src = "https://stream.zeno.fm/4d61wprrp7zuv";
        audioRef.current.crossOrigin = "anonymous";
      }
      
      // On joue ou on met en pause selon l'état
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setError("Erreur de lecture audio. Veuillez réessayer.");
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire l'audio. Connexion perdue ou source non disponible.",
            variant: "destructive",
          });
        }).finally(() => {
          setIsLoading(false);
        });
      } else {
        audioRef.current.pause();
        setIsLoading(false);
      }
    }
  }, [currentAudio, isPlaying, toast, setIsPlaying]);

  return {
    audioRef,
    volume,
    progress,
    duration,
    isLoading,
    error,
    handleVolumeChange,
    togglePlay,
    handleSeek,
  };
};
