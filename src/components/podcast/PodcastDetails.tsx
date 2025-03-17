
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
    <div className="p-6 sm:p-8">
      {episode.feedSource && (
        <Badge variant="outline" className="mb-4 bg-primary/20 text-primary border-primary/30">
          {episode.feedSource}
        </Badge>
      )}
      
      <PodcastActions
        episode={episode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
      />
      
      <div className="prose prose-lg prose-invert max-w-none">
        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
        <div 
          className="text-gray-300"
          dangerouslySetInnerHTML={{ __html: episode.description || '' }}
        />
      </div>
    </div>
  );
};

export default PodcastDetails;
