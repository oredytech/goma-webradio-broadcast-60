
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  const { data: podcastData, isLoading } = usePodcastFeed();
  
  let foundEpisode = null;
  let foundIndex = -1;
  
  if (podcastData && !isLoading) {
    const episodes = podcastData.allEpisodes;
    
    if (episodeId && slug) {
      const result = findEpisodeById(episodes, episodeId);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        navigate(`/podcast/${generatedSlug}`, { replace: true });
      }
    } 
    else if (episodeId && !slug) {
      if (/^\d+$/.test(episodeId)) {
        const result = findEpisodeById(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      } else {
        const result = findEpisodeBySlug(episodes, episodeId);
        foundEpisode = result.episode;
        foundIndex = result.index;
        
        if (foundEpisode) {
          const generatedSlug = getPodcastSlug(foundEpisode.title);
          if (episodeId !== generatedSlug) {
            navigate(`/podcast/${generatedSlug}`, { replace: true });
          }
        }
      }
    }
    else if (slug && !episodeId) {
      const result = findEpisodeBySlug(episodes, slug);
      foundEpisode = result.episode;
      foundIndex = result.index;
      
      if (foundEpisode) {
        const generatedSlug = getPodcastSlug(foundEpisode.title);
        if (slug !== generatedSlug) {
          navigate(`/podcast/${generatedSlug}`, { replace: true });
        }
      }
    }
  }

  if (isLoading) {
    return <PodcastLoading />;
  }

  if (!foundEpisode) {
    return <PodcastNotFound />;
  }

  const podcastImage = foundEpisode.itunes?.image || "/GOWERA__3_-removebg-preview.png";
  const podcastTitle = foundEpisode.title;
  const podcastDescription = foundEpisode.description || "Écoutez ce podcast sur GOMA WEBRADIO";
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Helmet>
        <title>{podcastTitle}</title>
        <meta name="description" content={podcastDescription} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={podcastTitle} />
        <meta property="og:description" content={podcastDescription} />
        <meta property="og:image" content={podcastImage} />
        <meta property="og:site_name" content="GOMA WEBRADIO" />
        <meta property="og:locale" content="fr_FR" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={podcastTitle} />
        <meta name="twitter:description" content={podcastDescription} />
        <meta name="twitter:image" content={podcastImage} />
      </Helmet>
      
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

        {podcastData && podcastData.allEpisodes.length > 1 && (
          <div className="mt-12">
            <SimilarPodcasts 
              currentEpisode={foundEpisode} 
              episodes={podcastData.allEpisodes}
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
