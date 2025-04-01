
import PlayPauseButton from './PlayPauseButton';
import VolumeControl from './VolumeControl';
import NavigationControls from './NavigationControls';

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  handleVolumeChange: (value: number[]) => void;
  togglePlay: () => void;
}

const AudioControls = ({
  isPlaying,
  isLoading,
  volume,
  currentAudio,
  setCurrentAudio,
  setIsPlaying,
  handleVolumeChange,
  togglePlay
}: AudioControlsProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4 text-white">
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
          togglePlay={togglePlay} 
        />
      )}
      
      <VolumeControl 
        volume={volume} 
        handleVolumeChange={handleVolumeChange} 
      />
    </div>
  );
};

export default AudioControls;
