import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2 } from 'lucide-react';

interface PodcastSectionProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
  setCurrentTrack: (title: string) => void;
  setCurrentArtist: (artist: string) => void;
}

const PodcastSection = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
  setCurrentTrack,
  setCurrentArtist
}: PodcastSectionProps) => {
  const navigate = useNavigate();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);

  const handlePlayEpisode = (episode: any) => {
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setCurrentTrack(episode.title);
    setCurrentArtist("Podcast");
    setIsPlaying(true);

    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingEpisode(null);
    });
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Podcasts</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/podcasts')}
            className="text-white hover:text-primary"
          >
            Voir plus
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes?.slice(0, 6).map((episode, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300">
              <img
                src={episode.itunes?.image || '/placeholder.svg'}
                alt={episode.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{episode.title}</h3>
                <p className="text-gray-300 line-clamp-2 mb-4">{episode.description}</p>
                <div className="relative">
                  {loadingEpisode === episode.enclosure.url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                      <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
                    </div>
                  )}
                  <Button
                    onClick={() => handlePlayEpisode(episode)}
                    className="w-full group relative z-10"
                    variant={currentAudio === episode.enclosure.url ? "secondary" : "default"}
                    disabled={loadingEpisode === episode.enclosure.url}
                  >
                    {currentAudio === episode.enclosure.url && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        En lecture
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Écouter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;