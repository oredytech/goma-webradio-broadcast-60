
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EpisodeNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  navigateToPreviousEpisode: () => void;
  navigateToNextEpisode: () => void;
  previousTitle?: string;
  nextTitle?: string;
}

const EpisodeNavigation = ({
  hasPrevious,
  hasNext,
  navigateToPreviousEpisode,
  navigateToNextEpisode,
  previousTitle,
  nextTitle
}: EpisodeNavigationProps) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          {previousTitle && hasPrevious && (
            <TooltipContent side="bottom">
              <p className="max-w-xs truncate">{previousTitle}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          {nextTitle && hasNext && (
            <TooltipContent side="bottom">
              <p className="max-w-xs truncate">{nextTitle}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EpisodeNavigation;
