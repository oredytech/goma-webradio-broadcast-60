import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PodcastsProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const Podcasts = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastsProps) => {
  const navigate = useNavigate();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);

  const handlePlayEpisode = (episode: any, index: number) => {
    navigate(`/podcast/${index}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-12">Tous les épisodes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-12">Tous les épisodes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes?.map((episode, index) => (
            <div 
              key={index} 
              className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={episode.itunes?.image || '/placeholder.svg'}
                alt={episode.title}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{episode.title}</h3>
                <p className="text-gray-300 line-clamp-3 mb-4">{episode.description}</p>
                <div className="relative">
                  {loadingEpisode === episode.enclosure.url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                      <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
                    </div>
                  )}
                  <Button
                    onClick={() => handlePlayEpisode(episode, index)}
                    className="w-full group relative z-10"
                    variant={currentAudio === episode.enclosure.url ? "secondary" : "default"}
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Écouter
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
