
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Play, Pause, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

interface PodcastPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastPlayer = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastPlayerProps) => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingAudio, setLoadingAudio] = useState(false);
  
  // Find the selected episode
  const episode = episodes?.find((ep, index) => index.toString() === episodeId);

  useEffect(() => {
    // Set page title
    if (episode) {
      document.title = `${episode.title} | GOMA WEBRADIO`;
    }
    
    return () => {
      document.title = 'GOMA WEBRADIO';
    };
  }, [episode]);

  const handlePlay = () => {
    if (!episode) return;
    
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingAudio(true);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingAudio(false);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: episode?.title,
        text: episode?.description,
        url: window.location.href,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }
  };

  if (isLoading || !episode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
        
        <div className="bg-secondary/50 rounded-lg overflow-hidden">
          <div className="aspect-video md:aspect-auto md:h-[400px] relative">
            <img 
              src={episode.itunes?.image || '/placeholder.svg'} 
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
                  {episode.title}
                </h1>
                <p className="text-gray-300 mb-4">
                  {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex gap-4 mb-6">
              <div className="relative">
                {loadingAudio && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                    <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
                  </div>
                )}
                <Button
                  onClick={handlePlay}
                  className="group relative z-10"
                  variant="default"
                  size="lg"
                  disabled={loadingAudio}
                >
                  {currentAudio === episode.enclosure.url && isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Écouter
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                onClick={handleShare}
                variant="secondary"
                size="lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </Button>
            </div>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-300">{episode.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PodcastPlayer;
