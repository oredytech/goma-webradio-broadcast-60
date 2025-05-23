
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  togglePlay: () => void;
}

const PlayPauseButton = ({ isPlaying, isLoading, togglePlay }: PlayPauseButtonProps) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/30 rounded-full"></div>
          <div className="absolute inset-0 bg-secondary/80 rounded-full"></div>
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin z-10" />
        </div>
      )}
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="icon"
        className="hover:bg-primary/20 relative z-10 active:scale-95 transition-transform"
        disabled={isLoading}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
        ) : (
          <Play className="h-5 w-5 sm:h-6 sm:w-6 text-foreground ml-0.5" />
        )}
      </Button>
    </div>
  );
};

export default PlayPauseButton;
