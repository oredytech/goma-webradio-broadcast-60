
import React from 'react';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PodcastHeaderProps {
  episode: PodcastEpisode;
  onPlayClick: () => void;
}

const PodcastHeader = ({ episode, onPlayClick }: PodcastHeaderProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Podcast image failed to load:", episode.itunes?.image);
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Image first on mobile, followed by content */}
      <div className="w-full max-w-xs mx-auto md:hidden">
        <img 
          src={episode.itunes?.image || '/placeholder.svg'} 
          alt={episode.title}
          className="w-full aspect-square object-cover rounded-lg"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      {/* Hide image on mobile (shown above), show on desktop */}
      <div className="hidden md:block w-full md:w-36 lg:w-48 shrink-0">
        <img 
          src={episode.itunes?.image || '/placeholder.svg'} 
          alt={episode.title}
          className="w-full aspect-square object-cover rounded-lg"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-white mb-2">
          À propos de cet épisode
        </h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <Button 
            onClick={onPlayClick}
            className="rounded-full gap-2 bg-primary hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            ÉCOUTER
          </Button>
          
          {episode.feedSource && (
            <div className="text-sm text-gray-400 flex items-center">
              {episode.feedSource}
            </div>
          )}
          
          {episode.pubDate && (
            <div className="text-sm text-gray-400 flex items-center">
              {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
        
        {episode.itunes?.duration && (
          <div className="text-sm text-gray-400 mb-2">
            Durée: {episode.itunes.duration}
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastHeader;
