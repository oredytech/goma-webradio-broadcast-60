
import { ToastActionElement } from '@/components/ui/toast';

interface UsePlaybackControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  volume: number;
  setVolume: (volume: number) => void;
  duration: number;
  setProgress: (progress: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  toast: {
    toast: (props: {
      title?: string;
      description?: string;
      action?: ToastActionElement;
      variant?: "default" | "destructive";
    }) => void;
  };
}

export const usePlaybackControls = ({
  audioRef,
  volume,
  setVolume,
  duration,
  setProgress,
  isPlaying,
  setIsPlaying,
  setIsLoading,
  setError,
  toast
}: UsePlaybackControlsProps) => {

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
        // Vérifiez si l'audio a déjà été chargé
        if (audioRef.current.readyState >= 2) {
          audioRef.current.play()
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              console.error('Playback error:', err);
              setIsLoading(false);
              setError("Impossible de lire l'audio. Veuillez réessayer.");
              toast.toast({
                title: "Erreur de lecture",
                description: "Impossible de lire l'audio. Veuillez réessayer.",
                variant: "destructive",
              });
              // Ne pas changer l'état isPlaying si on ne peut pas démarrer la lecture
              return;
            });
        } else {
          // Si l'audio n'est pas encore chargé, on charge d'abord
          audioRef.current.load();
          audioRef.current.play()
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              console.error('Playback error:', err);
              setIsLoading(false);
              setError("Impossible de lire l'audio. Veuillez réessayer.");
              toast.toast({
                title: "Erreur de lecture",
                description: "Impossible de lire l'audio. Veuillez réessayer.",
                variant: "destructive",
              });
              // Ne pas changer l'état isPlaying si on ne peut pas démarrer la lecture
              return;
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      const newTime = (value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  return {
    handleVolumeChange,
    togglePlay,
    handleSeek,
  };
};
