
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PodcastHeader from '@/components/podcast/PodcastHeader';
import PodcastDetails from '@/components/podcast/PodcastDetails';
import PodcastLoading from '@/components/podcast/PodcastLoading';
import PodcastNotFound from '@/components/podcast/PodcastNotFound';
import SimilarPodcasts from '@/components/podcast/SimilarPodcasts';
import { findEpisodeBySlug, findEpisodeById, getPodcastSlug } from '@/utils/podcastUtils';
import { usePodcastSEO } from '@/hooks/useSEO';

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
  const { data: episodes, isLoading } = usePodcastFeed();
  
  let foundEpisode = null;
  let foundIndex = -1;
  
  if (episodes && !isLoading) {
    if (episodeId && slug) {
      // Old format URL with ID and slug
      const result = findEpisodeById(episodes, episodeId);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        // Redirect to new URL format (without ID)
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        navigate(`/podcast/${generatedSlug}`, { replace: true });
      }
    } 
    else if (episodeId && !slug) {
      // Handle the case where episodeId might be numeric or might be the slug
      if (/^\d+$/.test(episodeId)) {
        // It's a numeric ID
        const result = findEpisodeById(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          // Redirect to new URL format
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      } else {
        // episodeId is actually a slug
        const result = findEpisodeBySlug(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          // Ensure URL has correct slug
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          if (episodeId !== generatedSlug) {
            navigate(`/podcast/${generatedSlug}`, { replace: true });
          }
        }
      }
    }
    else if (slug && !episodeId) {
      // New format: just the slug
      const result = findEpisodeBySlug(episodes, slug);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        // Ensure URL has correct slug
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        if (slug !== generatedSlug) {
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      }
    }
  }

  // Setup SEO for the podcast
  useEffect(() => {
    if (foundEpisode) {
      const podcastImage = foundEpisode.itunes?.image || "/GOWERA__3_-removebg-preview.png";
      const podcastTitle = foundEpisode.title;
      const podcastDescription = foundEpisode.description || "Écoutez ce podcast sur GOMA WEBRADIO";
      
      // Set meta tags directly for better compatibility
      document.title = podcastTitle;
      
      const metaTags = [
        { property: "og:title", content: podcastTitle },
        { property: "og:description", content: podcastDescription },
        { property: "og:image", content: podcastImage },
        { property: "og:url", content: window.location.href },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: podcastTitle },
        { name: "twitter:description", content: podcastDescription },
        { name: "twitter:image", content: podcastImage },
        { name: "description", content: podcastDescription }
      ];
      
      // Update meta tags
      metaTags.forEach(({ property, name, content }) => {
        if (property) {
          let meta = document.querySelector(`meta[property="${property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        }
        if (name) {
          let meta = document.querySelector(`meta[name="${name}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        }
      });
    }
  }, [foundEpisode]);

  if (isLoading) {
    return <PodcastLoading />;
  }

  if (!foundEpisode) {
    return <PodcastNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-8">
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
        
        <div className="bg-secondary/50 rounded-lg overflow-hidden">
          <PodcastHeader episode={foundEpisode} />
          <PodcastDetails 
            episode={foundEpisode}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentAudio={currentAudio}
            setCurrentAudio={setCurrentAudio}
          />
        </div>

        {/* Similar Podcasts Section */}
        {episodes && episodes.length > 1 && (
          <div className="mt-12">
            <SimilarPodcasts 
              currentEpisode={foundEpisode} 
              episodes={episodes}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PodcastPlayer;
