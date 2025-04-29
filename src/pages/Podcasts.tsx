
import { useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Button } from '@/components/ui/button';
import { Share2, Loader2, ChevronRight, Mic } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { getPodcastSlug } from '@/utils/podcastUtils';
import { Badge } from '@/components/ui/badge';

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
  const { data, isLoading } = usePodcastFeed();
  const { toast } = useToast();

  const handleOpenPodcast = (episode: any) => {
    // Create a slug from the episode title
    const slug = getPodcastSlug(episode.title);
    
    // Navigate to the podcast player page with slug only
    navigate(`/podcast/${slug}`);
  };

  const handleShare = (episode: any, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Create a slug from the episode title
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
        <div className="relative w-full h-[40vh] bg-gradient-to-r from-black to-secondary flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg')] bg-center bg-cover mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container relative z-10 px-4 mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">PODCASTS</h1>
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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
        {/* Footer est déjà inclus globalement dans App.tsx */}
      </div>
    );
  }

  if (!data || !data.feedEpisodes) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      {/* Hero Section with Microphone Background */}
      <div className="relative w-full h-[40vh] bg-gradient-to-r from-black to-secondary flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1740&auto=format&fit=crop')] bg-center bg-cover mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <Mic className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-foreground mb-4">PODCASTS</h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Découvrez notre collection de podcasts originaux.
          </p>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Render each feed separately */}
        {Object.entries(data.feedEpisodes).map(([feedId, { name, episodes }]) => (
          <div key={feedId} className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4">{name}</h2>
              <Button
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                onClick={() => navigate(`/podcasts/${feedId}`)}
              >
                les épisodes
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {episodes.slice(0, 3).map((episode, index) => (
                <div 
                  key={`${feedId}-${index}`} 
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
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{episode.title}</h3>
                    <p className="text-foreground/70 line-clamp-3 mb-4">
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
          </div>
        ))}
      </main>
      {/* Footer est déjà inclus globalement dans App.tsx */}
    </div>
  );
};

export default Podcasts;
