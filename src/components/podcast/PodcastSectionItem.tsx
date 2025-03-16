
import { useState } from 'react';
import { Play, Pause, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { createSlug } from '@/utils/articleUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PodcastSectionItemProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  currentAudio: string | null;
  loadingEpisode: string | null;
  handlePlayEpisode: (episode: PodcastEpisode) => void;
}

const PodcastSectionItem = ({
  episode,
  isPlaying,
  currentAudio,
  loadingEpisode,
  handlePlayEpisode,
}: PodcastSectionItemProps) => {
  const episodeSlug = createSlug(episode.title);

  // Format date to French locale
  const formatPubDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div 
      className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300"
    >
      <Link to={`/podcast/${episodeSlug}`}>
        <img 
          src={episode.itunes?.image || '/placeholder.svg'} 
          alt={episode.title} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{formatPubDate(episode.pubDate)}</span>
          <span className="text-sm text-gray-400">{episode.itunes?.duration || ''}</span>
        </div>
        <Link to={`/podcast/${episodeSlug}`}>
          <h3 className="text-xl font-bold text-white mb-2 hover:text-primary transition-colors">{episode.title}</h3>
        </Link>
        <p className="text-gray-300 mb-4 line-clamp-3">{episode.description}</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            {loadingEpisode === episode.enclosure.url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
              </div>
            )}
            <Button
              onClick={() => handlePlayEpisode(episode)}
              className="w-full group relative z-10"
              variant={currentAudio === episode.enclosure.url && isPlaying ? "secondary" : "default"}
              disabled={loadingEpisode === episode.enclosure.url}
            >
              {currentAudio === episode.enclosure.url && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  En lecture
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Écouter
                </>
              )}
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-transparent text-white hover:bg-white/10"
            asChild
          >
            <Link to={`/podcast/${episodeSlug}`}>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastSectionItem;
