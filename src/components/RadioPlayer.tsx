import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={togglePlay}
            className="group relative bg-primary hover:bg-primary/80 transition-all duration-300 rounded-full p-6 hover:scale-110"
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping group-hover:animate-none"></div>
            {isPlaying ? 
              <Pause className="w-10 h-10 text-white" /> : 
              <Play className="w-10 h-10 text-white ml-1" />
            }
          </button>
          <div className="text-white">
            <h3 className="font-semibold text-lg">Now Playing</h3>
            <p className="text-sm text-gray-300">Goma Webradio Live</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-48">
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
      <audio
        ref={audioRef}
        src="https://stream-url-here" // Replace with actual stream URL
        preload="none"
      />
    </div>
  );
};

export default RadioPlayer;