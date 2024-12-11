import { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener('playing', () => {
        navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      });
    }
  }, [setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentAudio || 'https://stream.zeno.fm/4d61wprrp7zuv';
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentAudio, isPlaying]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 h-[80px] p-2">
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
            <h3 className="font-semibold text-base sm:text-lg mt-1 truncate">{currentTrack}</h3>
            {currentArtist && (
              <p className="text-xs sm:text-sm text-gray-300 truncate">{currentArtist}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="hover:bg-primary/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              )}
            </Button>
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
      />
    </div>
  );
};

export default RadioPlayer;