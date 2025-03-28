
// Audio utility functions for the radio player

/**
 * Format seconds into a minutes:seconds display format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Set up media session handlers for browser media controls
 */
export const setupMediaSession = (
  setIsPlaying?: (isPlaying: boolean) => void
): void => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => setIsPlaying?.(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying?.(false));
  }
};

/**
 * Available keyboard shortcuts for the audio player
 * 
 * - Space: Play/Pause toggle
 * - Arrow Up: Volume up
 * - Arrow Down: Volume down
 */
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: 'Space',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown'
};
