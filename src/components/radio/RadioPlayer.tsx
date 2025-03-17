
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePlayerKeyboardControls } from '@/hooks/usePlayerKeyboardControls';
import useLiveStreamTitle from '@/hooks/useLiveStreamTitle';
import PlayerContainer from './PlayerContainer';
import TrackInfo from './TrackInfo';
import AudioControls from './AudioControls';

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
  
  // Setup keyboard shortcuts
  usePlayerKeyboardControls({
    volume,
    togglePlay,
    handleVolumeChange
  });

  const liveTitle = useLiveStreamTitle(currentAudio);

  return (
    <PlayerContainer 
      progress={progress} 
      currentAudio={currentAudio} 
      handleSeek={handleSeek}
    >
      <TrackInfo 
        currentAudio={currentAudio}
        currentTrack={currentTrack}
        currentArtist={currentArtist}
        liveTitle={liveTitle}
        duration={duration}
        progress={progress}
      />
      
      <AudioControls 
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
        setIsPlaying={setIsPlaying}
        handleVolumeChange={handleVolumeChange}
        togglePlay={togglePlay}
      />
    </PlayerContainer>
  );
};

export default RadioPlayer;
