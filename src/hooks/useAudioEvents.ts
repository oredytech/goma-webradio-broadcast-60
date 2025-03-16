
import { useEffect } from 'react';
import { ToastActionElement } from '@/components/ui/toast';

interface UseAudioEventsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentAudio: string | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: (callback: (prev: number) => number) => void;
  toast: {
    toast: (props: {
      title?: string;
      description?: string;
      action?: ToastActionElement;
      variant?: "default" | "destructive";
    }) => void;
  };
}

export const useAudioEvents = ({
  audioRef,
  currentAudio,
  isPlaying,
  setIsPlaying,
  setProgress,
  setDuration,
  setIsLoading,
  setError,
  retryCount,
  setRetryCount,
  toast
}: UseAudioEventsProps) => {

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
        setIsLoading(false);
      }
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
      setRetryCount(() => 0);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e, audio.error);
      setIsLoading(false);
      
      // Maximum retry attempts
      const maxRetries = 3;
      
      if (retryCount < maxRetries && currentAudio) {
        setRetryCount(prev => prev + 1);
        
        // Wait before retrying
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
              audioRef.current.play().catch(err => {
                console.error("Retry failed:", err);
                setIsPlaying(false);
                setError("Erreur de lecture audio après plusieurs tentatives.");
              });
            }
          }
        }, 2000);
        
        toast.toast({
          title: "Problème de connexion",
          description: `Tentative de reconnexion ${retryCount + 1}/${maxRetries}...`,
          variant: "destructive",
        });
      } else {
        setError("Erreur de lecture audio. Veuillez réessayer.");
        toast.toast({
          title: "Erreur de lecture",
          description: "Impossible de lire l'audio. Essayez avec un autre proxy CORS ou vérifiez votre connexion.",
          variant: "destructive",
        });
        setIsPlaying(false);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      // Si l'utilisateur veut jouer mais l'audio est en pause, on le démarre
      if (isPlaying && audio.paused) {
        audio.play().catch(e => {
          console.error("Error starting audio after canplay:", e);
        });
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (audio) {
        audio.currentTime = 0;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [toast, setIsPlaying, retryCount, currentAudio, isPlaying, setError, setIsLoading, setProgress, setDuration, setRetryCount, audioRef]);

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
        audioRef.current.preload = "auto"; // Ensure preloading
        
        // Fix pour certains navigateurs: ajouter un timestamp pour éviter le cache
        if (currentAudio.indexOf('?') === -1) {
          audioRef.current.src = currentAudio + '?t=' + new Date().getTime();
        }
        
        audioRef.current.load(); // Forcer le rechargement de l'audio
      } else if (!currentAudio && currentSrc !== "https://stream.zeno.fm/4d61wprrp7zuv") {
        // Si pas d'audio spécifique, on revient à la radio en direct
        setIsLoading(true);
        audioRef.current.src = "https://stream.zeno.fm/4d61wprrp7zuv";
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.load(); // Forcer le rechargement de l'audio
      }
      
      // On joue ou on met en pause selon l'état
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            // Si l'erreur est liée à l'interaction utilisateur, on ne change pas l'état de lecture
            if (error.name !== 'NotAllowedError') {
              setIsPlaying(false);
              setError("Erreur de lecture audio. Veuillez réessayer.");
              toast.toast({
                title: "Erreur de lecture",
                description: "Impossible de lire l'audio. Problème de CORS ou source non disponible.",
                variant: "destructive",
              });
            }
          }).finally(() => {
            setIsLoading(false);
          });
        }
      } else {
        audioRef.current.pause();
        setIsLoading(false);
      }
    }
  }, [currentAudio, isPlaying, toast, setIsPlaying, setError, setIsLoading, audioRef]);
};
