
import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { formatTime } from "@/utils/audioUtils";
import PlaybackControls from "@/components/radio/PlaybackControls";
import VolumeControl from "@/components/radio/VolumeControl";
import PlayerInfo from "@/components/radio/PlayerInfo";

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
}

const RadioPlayer = ({ isPlaying, setIsPlaying, currentAudio }: RadioPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");
  
  const {
    audioRef,
    volume,
    progress,
    duration,
    isLoading,
    error,
    handleVolumeChange,
    togglePlay,
    handleSeek,
  } = useAudioPlayer({ currentAudio, isPlaying, setIsPlaying });

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
          <PlayerInfo 
            currentAudio={currentAudio}
            error={error}
            currentTrack={currentTrack}
            currentArtist={currentArtist}
            progress={progress}
            duration={duration}
            audioRef={audioRef}
            formatTime={formatTime}
          />
          
          <div className="flex items-center gap-2 sm:gap-4">
            <PlaybackControls 
              isPlaying={isPlaying}
              isLoading={isLoading}
              togglePlay={togglePlay}
            />
            <VolumeControl 
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
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
