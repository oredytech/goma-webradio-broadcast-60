
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import PodcastCard from './PodcastCard';

interface PodcastGridProps {
  episodes: PodcastEpisode[];
  isPlaying: boolean;
  currentAudio: string | null;
  loadingEpisode: string | null;
  onPlayEpisode: (episode: PodcastEpisode) => void;
}

const PodcastGrid = ({
  episodes,
  isPlaying,
  currentAudio,
  loadingEpisode,
  onPlayEpisode
}: PodcastGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {episodes.map((episode, index) => (
        <PodcastCard
          key={index}
          episode={episode}
          isPlaying={isPlaying}
          currentAudio={currentAudio}
          loadingEpisode={loadingEpisode}
          onPlayEpisode={onPlayEpisode}
        />
      ))}
    </div>
  );
};

export default PodcastGrid;
