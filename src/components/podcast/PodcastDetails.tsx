
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import PodcastActions from './PodcastActions';

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
      <PodcastActions
        episode={episode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
      />
      
      <div className="prose prose-lg prose-invert max-w-none">
        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
        <p className="text-gray-300">{episode.description}</p>
      </div>
    </div>
  );
};

export default PodcastDetails;
