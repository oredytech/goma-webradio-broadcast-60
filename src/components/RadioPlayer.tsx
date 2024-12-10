import { useState, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const RadioPlayer = ({ isPlaying, setIsPlaying }: RadioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        <div className="text-white">
          <h3 className="font-semibold text-lg">Now Playing</h3>
          <p className="text-sm text-gray-300">Goma Webradio Live</p>
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
        src="https://stream.zeno.fm/4d61wprrp7zuv"
        preload="none"
      />
    </div>
  );
};

export default RadioPlayer;