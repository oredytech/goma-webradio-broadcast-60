
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import PodcastActions from './PodcastActions';
import { Badge } from '@/components/ui/badge';

interface PodcastDetailsProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastDetails = ({
  episode,
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastDetailsProps) => {
  return (
    <div className="mb-8">
      {episode.feedSource && (
        <Badge variant="outline" className="mb-4 bg-primary/20 text-primary border-primary/30">
          {episode.feedSource}
        </Badge>
      )}
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
        <div 
          className="text-foreground/70"
          dangerouslySetInnerHTML={{ __html: episode.description || '' }}
        />
      </div>
    </div>
  );
};

export default PodcastDetails;
