
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import ProgressBar from './ProgressBar';
import PlayPauseButton from './PlayPauseButton';
import VolumeControl from './VolumeControl';
import NavigationControls from './NavigationControls';
import TrackInfo from './TrackInfo';
import useLiveStreamTitle from '@/hooks/useLiveStreamTitle';

interface RadioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
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

  const liveTitle = useLiveStreamTitle(currentAudio);

  const handleTogglePlay = () => {
    // Make sure togglePlay updates the global state
    togglePlay();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 h-[80px] p-2 z-50">
      <div className="max-w-7xl mx-auto h-full">
        <ProgressBar 
          progress={progress} 
          handleSeek={handleSeek} 
          showProgress={Boolean(currentAudio)}
        />
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <TrackInfo 
            currentAudio={currentAudio}
            currentTrack={currentTrack}
            currentArtist={currentArtist}
            liveTitle={liveTitle}
            duration={duration}
            progress={progress}
          />
          
          <div className="flex items-center gap-2 sm:gap-4">
            {currentAudio && (
              <NavigationControls 
                currentAudio={currentAudio}
                setCurrentAudio={setCurrentAudio}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
              />
            )}
            
            {!currentAudio && (
              <PlayPauseButton 
                isPlaying={isPlaying} 
                isLoading={isLoading} 
                togglePlay={handleTogglePlay} 
              />
            )}
            
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
