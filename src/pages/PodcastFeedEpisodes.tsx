
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Button } from '@/components/ui/button';
import { Share2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { getPodcastSlug } from '@/utils/podcastUtils';
import { Badge } from '@/components/ui/badge';

interface PodcastFeedEpisodesProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastFeedEpisodes = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastFeedEpisodesProps) => {
  const navigate = useNavigate();
  const { feedId } = useParams<{ feedId: string }>();
  const { data, isLoading } = usePodcastFeed();
  const { toast } = useToast();

  const feedData = feedId && data?.feedEpisodes[feedId];

  const handleOpenPodcast = (episode: any) => {
    const slug = getPodcastSlug(episode.title);
    navigate(`/podcast/${slug}`);
  };

  const handleShare = (episode: any, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const slug = getPodcastSlug(episode.title);
    const shareUrl = `${window.location.origin}/podcast/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: episode.description,
        url: shareUrl,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }
  };

  // Function to strip HTML tags from text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="text-white mr-4" 
              onClick={() => navigate('/podcasts')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold text-white">Chargement...</h1>
          </div>
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

  if (!data || !feedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="text-white mr-4" 
              onClick={() => navigate('/podcasts')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold text-white">Podcast non trouvé</h1>
          </div>
          <p className="text-white">Ce podcast n'existe pas ou a été supprimé.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="text-white mr-4" 
            onClick={() => navigate('/podcasts')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold text-white">{feedData.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedData.episodes.map((episode, index) => (
            <div 
              key={index} 
              className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleOpenPodcast(episode)}
            >
              <img
                src={episode.itunes?.image || '/placeholder.svg'}
                alt={episode.title}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.svg"}
                loading="lazy"
              />
              <div className="p-6">
                <Badge variant="outline" className="mb-2 bg-primary/20 text-primary border-primary/30">
                  {episode.feedSource}
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{episode.title}</h3>
                <p className="text-gray-300 line-clamp-3 mb-4">
                  {episode.description ? stripHtml(episode.description) : ''}
                </p>
                <div className="flex justify-end">
                  <Button
                    onClick={(e) => handleShare(episode, e)}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
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

export default PodcastFeedEpisodes;
