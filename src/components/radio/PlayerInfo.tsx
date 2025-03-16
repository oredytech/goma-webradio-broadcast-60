
import { AlertCircle } from 'lucide-react';

interface PlayerInfoProps {
  currentAudio: string | null;
  error: string | null;
  currentTrack: string;
  currentArtist: string;
  progress: number;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  formatTime: (seconds: number) => string;
}

const PlayerInfo = ({ 
  currentAudio, 
  error, 
  currentTrack, 
  currentArtist,
  progress,
  duration,
  audioRef,
  formatTime
}: PlayerInfoProps) => {
  return (
    <div className="text-white flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
          {currentAudio ? "Podcast" : "En Direct"}
        </span>
        {currentAudio && duration > 0 && (
          <span className="text-xs text-gray-400">
            {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-base sm:text-lg mt-1 truncate">
        {error ? "Erreur de lecture" : (currentAudio ? currentTrack : "Goma Webradio Live")}
      </h3>
      {error ? (
        <p className="text-xs sm:text-sm text-red-400 truncate flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      ) : (
        currentArtist && (
          <p className="text-xs sm:text-sm text-gray-300 truncate">{currentArtist}</p>
        )
      )}
    </div>
  );
};

export default PlayerInfo;
