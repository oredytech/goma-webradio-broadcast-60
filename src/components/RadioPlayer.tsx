
import { formatTime } from '@/utils/audioUtils';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import ProgressBar from './radio/ProgressBar';
import PlayPauseButton from './radio/PlayPauseButton';
import VolumeControl from './radio/VolumeControl';

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying?: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const RadioPlayer = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: RadioPlayerProps) => {
  const {
    volume,
    currentTrack,
    currentArtist,
    progress,
    duration,
    isLoading,
    handleVolumeChange,
    togglePlay,
    handleSeek
  } = useAudioPlayer({
    isPlaying,
    setIsPlaying,
    currentAudio,
    setCurrentAudio
  });
  
  // Define volume adjustment handlers
  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 5, 100);
    handleVolumeChange([newVolume]);
  };
  
  const handleVolumeDown = () => {
    const newVolume = Math.max(volume - 5, 0);
    handleVolumeChange([newVolume]);
  };
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
    enabled: true
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 h-[80px] p-2 z-50">
      <div className="max-w-7xl mx-auto h-full">
        <ProgressBar 
          progress={progress} 
          handleSeek={handleSeek} 
          showProgress={Boolean(currentAudio)}
        />
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="text-white flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                {currentAudio ? "Podcast" : "En Direct"}
              </span>
              {currentAudio && duration > 0 && (
                <span className="text-xs text-gray-400">
                  {formatTime(duration * (progress / 100))} / {formatTime(duration)}
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
            <PlayPauseButton 
              isPlaying={isPlaying} 
              isLoading={isLoading} 
              togglePlay={togglePlay} 
            />
            <VolumeControl 
              volume={volume} 
              handleVolumeChange={handleVolumeChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
