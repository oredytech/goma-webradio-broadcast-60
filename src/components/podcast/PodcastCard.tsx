
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, ExternalLink } from 'lucide-react';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { createSlug } from '@/utils/articleUtils';

interface PodcastCardProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  currentAudio: string | null;
  onPlayEpisode: (episode: PodcastEpisode) => void;
  loadingEpisode: string | null;
}

const PodcastCard = ({
  episode,
  isPlaying,
  currentAudio,
  onPlayEpisode,
  loadingEpisode
}: PodcastCardProps) => {
  const episodeSlug = createSlug(episode.title);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Clean up loading state if component unmounts while loading
  useEffect(() => {
    return () => {
      // Component cleanup logic if needed
    };
  }, []);
  
  return (
    <div 
      className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link to={`/podcast/${episodeSlug}`} className="block relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary/70 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        <img
          src={episode.itunes?.image || '/placeholder.svg'}
          alt={episode.title}
          className={`w-full h-48 object-cover transition-transform duration-300 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <Link to={`/podcast/${episodeSlug}`} className="hover:text-primary transition-colors">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{episode.title}</h3>
        </Link>
        <p className="text-gray-300 line-clamp-3 mb-4">{episode.description}</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            {loadingEpisode === episode.enclosure.url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
              </div>
            )}
            <Button
              onClick={() => onPlayEpisode(episode)}
              className="w-full group relative z-10"
              variant={currentAudio === episode.enclosure.url ? "secondary" : "default"}
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

export default PodcastCard;
