
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Play, Pause, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { updateMetaTags } from '@/utils/metaService';

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
  const { episodeId, slug } = useParams<{ episodeId?: string; slug?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [foundEpisodeIndex, setFoundEpisodeIndex] = useState<number | null>(null);
  
  // Find the selected episode
  useEffect(() => {
    if (!episodes || isLoading) return;
    
    if (episodeId && slug) {
      // Old format URL with ID and slug
      const index = parseInt(episodeId);
      if (!isNaN(index) && index >= 0 && index < episodes.length) {
        setFoundEpisodeIndex(index);
        
        // Redirect to new URL format (without ID)
        const generatedSlug = episodes[index].title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        navigate(`/podcast/${generatedSlug}`, { replace: true });
      }
    } 
    else if (episodeId && !slug) {
      // Handle the case where episodeId might be numeric or might be the slug
      if (/^\d+$/.test(episodeId)) {
        // It's a numeric ID
        const index = parseInt(episodeId);
        if (!isNaN(index) && index >= 0 && index < episodes.length) {
          setFoundEpisodeIndex(index);
          
          // Redirect to new URL format
          const generatedSlug = episodes[index].title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
            
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      } else {
        // episodeId is actually a slug
        const index = episodes.findIndex(ep => {
          const episodeSlug = ep.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          
          return episodeId === episodeSlug || 
                 episodeId.includes(episodeSlug) || 
                 episodeSlug.includes(episodeId) ||
                 ep.title.toLowerCase().includes(episodeId.toLowerCase());
        });
        
        if (index !== -1) {
          setFoundEpisodeIndex(index);
          
          // Ensure URL has correct slug
          const generatedSlug = episodes[index].title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
            
          if (episodeId !== generatedSlug) {
            navigate(`/podcast/${generatedSlug}`, { replace: true });
          }
        }
      }
    }
    else if (slug && !episodeId) {
      // New format: just the slug
      const index = episodes.findIndex(ep => {
        const episodeSlug = ep.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        return slug === episodeSlug || 
               slug.includes(episodeSlug) || 
               episodeSlug.includes(slug) ||
               ep.title.toLowerCase().includes(slug.toLowerCase());
      });
      
      if (index !== -1) {
        setFoundEpisodeIndex(index);
        
        // Ensure URL has correct slug
        const generatedSlug = episodes[index].title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        if (slug !== generatedSlug) {
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      }
    }
  }, [episodes, isLoading, episodeId, slug, navigate]);

  const episode = foundEpisodeIndex !== null && episodes ? episodes[foundEpisodeIndex] : null;

  useEffect(() => {
    // Set page title and meta tags
    if (episode) {
      document.title = `${episode.title} | GOMA WEBRADIO`;
      
      updateMetaTags({
        title: episode.title,
        description: episode.description.substring(0, 160),
        image: episode.itunes?.image || '/GOWERA__3_-removebg-preview.png',
        type: 'article',
        url: window.location.href
      });
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
    if (!episode) return;
    
    // Generate slug
    const generatedSlug = episode.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    // Use the new URL format without ID
    const shareUrl = `${window.location.origin}/podcast/${generatedSlug}`;
    
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

  if (isLoading) {
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

  if (!episode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-white text-xl">Podcast non trouvé</div>
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
