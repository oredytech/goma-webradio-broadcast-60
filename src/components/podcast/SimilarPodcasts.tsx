
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug } from '@/utils/podcastUtils';
import ViewToggle from './ViewToggle';
import PodcastGrid from './PodcastGrid';
import PodcastList from './PodcastList';

interface SimilarPodcastsProps {
  currentEpisode: PodcastEpisode;
  episodes: PodcastEpisode[];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const SimilarPodcasts = ({
  currentEpisode,
  episodes,
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: SimilarPodcastsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [viewMode, setViewMode] = useState<string>("grid");

  // Get episodes from the same feed as the current episode
  const sameFeedEpisodes = useMemo(() => {
    if (!currentEpisode.feedSource) return [];
    
    return episodes
      .filter(ep => 
        ep.feedSource === currentEpisode.feedSource && 
        ep.title !== currentEpisode.title
      )
      .sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 8);
  }, [episodes, currentEpisode]);

  const handleOpenPodcast = (episode: PodcastEpisode) => {
    const slug = getPodcastSlug(episode.title);
    navigate(`/podcast/${slug}`);
  };

  if (sameFeedEpisodes.length === 0) {
    return null;
  }

  return (
    <div className="similar-podcasts">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Autres épisodes {currentEpisode.feedSource && `de ${currentEpisode.feedSource}`}
        </h2>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>
      
      <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/70 text-gray-300 mb-6">
          <TabsTrigger value="feed">Suite du podcast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="focus-visible:outline-none">
          {viewMode === "grid" 
            ? <PodcastGrid episodes={sameFeedEpisodes} onOpenPodcast={handleOpenPodcast} />
            : <PodcastList episodes={sameFeedEpisodes} onOpenPodcast={handleOpenPodcast} />
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimilarPodcasts;
