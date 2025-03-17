
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug } from '@/utils/podcastUtils';
import { useNavigate } from 'react-router-dom';

interface EpisodeNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  navigateToPreviousEpisode: () => void;
  navigateToNextEpisode: () => void;
}

const EpisodeNavigation = ({
  hasPrevious,
  hasNext,
  navigateToPreviousEpisode,
  navigateToNextEpisode
}: EpisodeNavigationProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrevious}
        onClick={navigateToPreviousEpisode}
        className={!hasPrevious ? "opacity-50 cursor-not-allowed" : ""}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Précédent
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNext}
        onClick={navigateToNextEpisode}
        className={!hasNext ? "opacity-50 cursor-not-allowed" : ""}
      >
        Suivant
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
};

export default EpisodeNavigation;
