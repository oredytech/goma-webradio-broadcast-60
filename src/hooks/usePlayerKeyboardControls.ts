
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

interface UsePlayerKeyboardControlsProps {
  volume: number;
  togglePlay: () => void;
  handleVolumeChange: (value: number[]) => void;
}

export const usePlayerKeyboardControls = ({
  volume,
  togglePlay,
  handleVolumeChange
}: UsePlayerKeyboardControlsProps) => {
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

  return {
    handleVolumeUp,
    handleVolumeDown
  };
};
