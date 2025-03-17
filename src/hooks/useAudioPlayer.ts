
import { useState, useRef, useEffect } from 'react';
import { setupMediaSession } from '../utils/audioUtils';

interface UseAudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying?: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

export const useAudioPlayer = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio
}: UseAudioPlayerProps) => {
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementCreated = useRef<boolean>(false);
  const loadingTimeoutRef = useRef<number | null>(null);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      setIsLoading(true);
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a maximum loading time
      loadingTimeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsLoading(false);
        if (loadingTimeoutRef.current !== null) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      } else {
        audioRef.current.play().then(() => {
          setIsLoading(false);
          if (loadingTimeoutRef.current !== null) {
            window.clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
        }).catch(error => {
          console.error('Error playing audio:', error);
          setIsLoading(false);
          if (loadingTimeoutRef.current !== null) {
            window.clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
        });
      }
      setIsPlaying?.(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && currentAudio) {
      const newTime = (value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioElementCreated.current) {
      const audio = new Audio();
      audioRef.current = audio;
      audioElementCreated.current = true;
      
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      });

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });

      audio.addEventListener('playing', () => {
        setIsLoading(false);
        setupMediaSession(setIsPlaying);
      });

      audio.addEventListener('waiting', () => {
        setIsLoading(true);
      });
      
      audio.addEventListener('canplay', () => {
        setIsLoading(false);
      });
      
      audio.addEventListener('error', () => {
        setIsLoading(false);
        console.error('Audio playback error');
      });

      audio.volume = volume / 100;
    }

    return () => {
      // Clean up timeout on unmount
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Handle audio source changes and play/pause state
  useEffect(() => {
    if (audioRef.current) {
      const currentSource = audioRef.current.src;
      const newSource = currentAudio || 'https://stream.zeno.fm/4d61wprrp7zuv';
      
      if (currentSource !== newSource) {
        setIsLoading(true);
        
        // Clear any existing timeout
        if (loadingTimeoutRef.current !== null) {
          window.clearTimeout(loadingTimeoutRef.current);
        }
        
        // Set a maximum loading time
        loadingTimeoutRef.current = window.setTimeout(() => {
          setIsLoading(false);
        }, 5000);
        
        audioRef.current.src = newSource;
      }
      
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying?.(false);
          setIsLoading(false);
        });
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsLoading(false);
      }
    }
  }, [currentAudio, isPlaying]);

  // Clear loading state after a maximum time to prevent UI getting stuck
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return {
    volume,
    currentTrack,
    currentArtist,
    progress,
    duration,
    isLoading,
    handleVolumeChange,
    togglePlay,
    handleSeek
  };
};
