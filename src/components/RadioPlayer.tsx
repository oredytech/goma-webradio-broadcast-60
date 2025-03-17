
import { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Loader2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying?: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const RadioPlayer = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: RadioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementCreated = useRef<boolean>(false);
  const loadingTimeoutRef = useRef<number | null>(null);

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
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a maximum loading time
      loadingTimeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsLoading(false);
        if (loadingTimeoutRef.current !== null) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      } else {
        audioRef.current.play().then(() => {
          setIsLoading(false);
          if (loadingTimeoutRef.current !== null) {
            window.clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
        }).catch(error => {
          console.error('Error playing audio:', error);
          setIsLoading(false);
          if (loadingTimeoutRef.current !== null) {
            window.clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
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
    if (!audioElementCreated.current) {
      const audio = new Audio();
      audioRef.current = audio;
      audioElementCreated.current = true;
      
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      });

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });

      audio.addEventListener('playing', () => {
        setIsLoading(false);
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', () => setIsPlaying?.(true));
          navigator.mediaSession.setActionHandler('pause', () => setIsPlaying?.(false));
        }
      });

      audio.addEventListener('waiting', () => {
        setIsLoading(true);
      });
      
      audio.addEventListener('canplay', () => {
        setIsLoading(false);
      });
      
      audio.addEventListener('error', () => {
        setIsLoading(false);
        console.error('Audio playback error');
      });

      audio.volume = volume / 100;
    }

    return () => {
      // Clean up timeout on unmount
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const currentSource = audioRef.current.src;
      const newSource = currentAudio || 'https://stream.zeno.fm/4d61wprrp7zuv';
      
      if (currentSource !== newSource) {
        setIsLoading(true);
        
        // Clear any existing timeout
        if (loadingTimeoutRef.current !== null) {
          window.clearTimeout(loadingTimeoutRef.current);
        }
        
        // Set a maximum loading time
        loadingTimeoutRef.current = window.setTimeout(() => {
          setIsLoading(false);
        }, 5000);
        
        audioRef.current.src = newSource;
      }
      
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsLoading(false);
      }
    }
  }, [currentAudio, isPlaying]);

  // Clear loading state after a maximum time to prevent UI getting stuck
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

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
              {currentAudio ? currentTrack : "Goma Webradio Live"}
            </h3>
            {currentArtist && (
              <p className="text-xs sm:text-sm text-gray-300 truncate">{currentArtist}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/30 rounded-full"></div>
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
    </div>
  );
};

export default RadioPlayer;
