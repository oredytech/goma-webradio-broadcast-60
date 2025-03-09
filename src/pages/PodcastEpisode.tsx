
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createSlug } from '@/utils/articleUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PodcastEpisodeProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastEpisode = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastEpisodeProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);
  
  // Trouver l'épisode correspondant au slug
  const episode = episodes?.find(ep => createSlug(ep.title) === slug);
  
  useEffect(() => {
    // Rediriger vers la page des podcasts si l'épisode n'existe pas
    if (!isLoading && !episode && episodes?.length > 0) {
      navigate('/podcasts');
    }
  }, [episode, isLoading, episodes, navigate]);

  const handlePlayEpisode = () => {
    if (!episode) return;
    
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingEpisode(null);
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading || !episode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const episodeImage = episode.itunes?.image || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="text-white mb-8 hover:bg-white/10"
          onClick={() => navigate('/podcasts')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux podcasts
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="bg-secondary/50 rounded-lg overflow-hidden">
              <img 
                src={episodeImage} 
                alt={episode.title} 
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-8">
            <div className="bg-secondary/30 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{episode.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(episode.pubDate)}</span>
                </div>
                {episode.itunes?.duration && (
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{episode.itunes.duration}</span>
                  </div>
                )}
              </div>
              
              <div className="prose prose-invert max-w-none mb-8" 
                dangerouslySetInnerHTML={{ __html: episode.description || '' }} 
              />
              
              <div className="relative">
                {loadingEpisode === episode.enclosure.url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                    <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
                  </div>
                )}
                <Button
                  onClick={handlePlayEpisode}
                  className="w-full sm:w-auto group relative z-10"
                  size="lg"
                  variant={currentAudio === episode.enclosure.url ? "secondary" : "default"}
                  disabled={loadingEpisode === episode.enclosure.url}
                >
                  {currentAudio === episode.enclosure.url && isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Mettre en pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Écouter l'épisode
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PodcastEpisode;
