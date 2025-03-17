
import { formatTime } from '@/utils/audioUtils';

interface TrackInfoProps {
  currentAudio: string | null;
  currentTrack: string;
  currentArtist: string | null;
  liveTitle: string | null;
  duration: number;
  progress: number;
}

const TrackInfo = ({ 
  currentAudio, 
  currentTrack, 
  currentArtist, 
  liveTitle, 
  duration, 
  progress 
}: TrackInfoProps) => {
  return (
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
        {!currentAudio && liveTitle && (
          <span className="text-xs text-gray-300 truncate">
            {liveTitle}
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
  );
};

export default TrackInfo;
