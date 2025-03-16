
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudioEvents } from './useAudioEvents';
import { usePlaybackControls } from './usePlaybackControls';

interface UseAudioPlayerProps {
  currentAudio: string | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useAudioPlayer = ({ currentAudio, isPlaying, setIsPlaying }: UseAudioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Import functionality from separate hooks
  const { handleVolumeChange, togglePlay, handleSeek } = usePlaybackControls({
    audioRef,
    volume,
    setVolume,
    duration,
    setProgress,
    isPlaying,
    setIsPlaying,
    setIsLoading,
    setError,
    toast
  });

  // Set up audio event listeners
  useAudioEvents({
    audioRef,
    currentAudio,
    isPlaying,
    setIsPlaying,
    setProgress,
    setDuration,
    setIsLoading,
    setError,
    retryCount,
    setRetryCount,
    toast
  });

  return {
    audioRef,
    volume,
    progress,
    duration,
    isLoading,
    error,
    handleVolumeChange,
    togglePlay,
    handleSeek,
  };
};
