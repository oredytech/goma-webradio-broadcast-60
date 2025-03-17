
import { useEffect } from 'react';

type KeyboardShortcutsProps = {
  onPlayPause?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  enabled?: boolean;
};

export const useKeyboardShortcuts = ({
  onPlayPause,
  onVolumeUp,
  onVolumeDown,
  enabled = true
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, etc.
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Handle keyboard shortcuts
      switch (event.code) {
        case 'Space':
          if (onPlayPause) {
            event.preventDefault();
            onPlayPause();
          }
          break;
        case 'ArrowUp':
          if (onVolumeUp) {
            event.preventDefault();
            onVolumeUp();
          }
          break;
        case 'ArrowDown':
          if (onVolumeDown) {
            event.preventDefault();
            onVolumeDown();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPlayPause, onVolumeUp, onVolumeDown, enabled]);
};
