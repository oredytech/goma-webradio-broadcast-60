
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';

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

  return (
    <div className="relative w-full bg-[#1f2137] py-12 overflow-hidden">
      {/* Background pattern with the podcast image */}
      <div className="absolute inset-0 opacity-10 bg-repeat" 
           style={{
             backgroundImage: `url(${imageUrl})`, 
             backgroundSize: '200px',
             filter: 'blur(1px)'
           }}>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary/95"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left content: Title, description, and action buttons */}
          <div className="flex-1 text-white max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h1>
            
            <p className="text-gray-300 text-lg mb-6 line-clamp-4">
              {stripHtml(description)}
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <Button 
                onClick={onPlayClick}
                size="lg"
                className="rounded-full px-8 gap-2 bg-primary hover:bg-primary/90"
              >
                <Play className="h-5 w-5" />
                ÉCOUTER
              </Button>
              
              {episode.feedSource && (
                <div className="text-sm text-gray-300">
                  {episode.feedSource}
                </div>
              )}
            </div>
            
            {episode.pubDate && (
              <div className="text-sm text-gray-400">
                {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
          
          {/* Right content: Podcast artwork */}
          <div className="w-full md:w-64 lg:w-80 shrink-0">
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
