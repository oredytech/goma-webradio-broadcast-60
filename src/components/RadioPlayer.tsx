
import { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
}

const RadioPlayer = ({ isPlaying, setIsPlaying, currentAudio }: RadioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 h-[80px] p-2 z-50">
      <div className="max-w-7xl mx-auto h-full">
        {currentAudio && (
          <Progress 
            value={progress} 
            onSeek={handleSeek}
            className="mb-2" 
          />
        )}
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="text-white flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                {currentAudio ? "Podcast" : "En Direct"}
              </span>
              {currentAudio && duration > 0 && (
                <span className="text-xs text-gray-400">
                  {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base sm:text-lg mt-1 truncate">
              {error ? "Erreur de lecture" : (currentAudio ? currentTrack : "Goma Webradio Live")}
            </h3>
            {error ? (
              <p className="text-xs sm:text-sm text-red-400 truncate flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            ) : (
              currentArtist && (
                <p className="text-xs sm:text-sm text-gray-300 truncate">{currentArtist}</p>
              )
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-secondary/80 rounded-full"></div>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin z-10" />
                </div>
              )}
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 relative z-10"
                disabled={isLoading}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                )}
              </Button>
            </div>
            <div className="hidden sm:flex items-center gap-4 w-48">
              <Volume2 className="w-5 h-5 text-white" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentAudio || "https://stream.zeno.fm/4d61wprrp7zuv"}
        preload="none"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default RadioPlayer;
