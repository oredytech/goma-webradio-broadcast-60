
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { useIsMobile } from '@/hooks/use-mobile';

interface PodcastHeroProps {
  title: string;
  description: string;
  imageUrl: string;
  episode: PodcastEpisode;
  onPlayClick: () => void;
}

const PodcastHero = ({ title, description, imageUrl, episode, onPlayClick }: PodcastHeroProps) => {
  const navigate = useNavigate();
  
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Use the episode's image for the background pattern
  const backgroundImage = episode.itunes?.image || imageUrl;

  return (
    <div className="relative w-full bg-secondary py-12 overflow-hidden">
      {/* Background pattern with the episode image */}
      <div className="absolute inset-0 opacity-10 bg-no-repeat bg-cover" 
           style={{
             backgroundImage: `url(${backgroundImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             filter: 'blur(1px)'
           }}>
      </div>
      
      {/* Dark overlay with stronger opacity for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-secondary/90 pt-20"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center text-center md:text-left gap-8 mt-5">
          {/* Content: Title and action buttons */}
          <div className="flex-1 text-white max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <Button 
                onClick={onPlayClick}
                size="lg"
                className="rounded-full px-8 gap-2 bg-primary hover:bg-primary/90"
              >
                <Play className="h-5 w-5" />
                ÉCOUTER
              </Button>
              
              {episode.feedSource && (
                <div className="text-sm text-gray-200">
                  {episode.feedSource}
                </div>
              )}
            </div>
            
            {episode.pubDate && (
              <div className="text-sm text-gray-200">
                {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
          
          {/* Podcast artwork */}
          <div className="w-full max-w-xs md:w-64 lg:w-80 shrink-0">
            <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastHero;
