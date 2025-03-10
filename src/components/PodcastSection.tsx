
import { useState, useEffect } from 'react';
import { Play, Pause, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createSlug } from '@/utils/articleUtils';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PodcastSectionProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
  setCurrentTrack?: (title: string) => void;
  setCurrentArtist?: (artist: string) => void;
}

const PodcastSection = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
  setCurrentTrack,
  setCurrentArtist,
}: PodcastSectionProps) => {
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);
  
  // Only display the 3 most recent episodes
  const recentEpisodes = episodes?.slice(0, 3) || [];

  const handlePlayEpisode = (episode: any) => {
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    // Set track and artist information for media session if provided
    if (setCurrentTrack) {
      setCurrentTrack(episode.title);
    }
    
    if (setCurrentArtist) {
      setCurrentArtist("Goma Webradio");
    }

    // Simuler la fin du chargement lorsque l'audio commence à jouer
    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingEpisode(null);
    });
  };

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
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Nos Podcasts</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Découvrez nos podcasts sur des sujets d'actualité, interviews exclusives et analyses approfondies.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEpisodes.map((episode, index) => {
              const episodeSlug = createSlug(episode.title);
              return (
                <div 
                  key={index} 
                  className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300"
                >
                  <Link to={`/podcast/${episodeSlug}`}>
                    <img 
                      src={episode.itunes?.image || '/placeholder.svg'} 
                      alt={episode.title} 
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
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
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild variant="secondary" className="px-8 py-6 text-lg">
            <Link to="/podcasts">
              Voir tous nos podcasts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
