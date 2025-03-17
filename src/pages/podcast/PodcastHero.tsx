
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PodcastHeroProps {
  title: string;
  description: string;
  imageUrl: string;
}

const PodcastHero = ({ title, description, imageUrl }: PodcastHeroProps) => {
  const navigate = useNavigate();
  
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="relative w-full h-[50vh] bg-gradient-to-r from-black to-secondary flex items-center justify-center pt-10">
      <div className="absolute inset-0 opacity-30 bg-center bg-cover" style={{backgroundImage: `url(${imageUrl})`}}></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container relative z-10 px-4 mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto">
          {title}
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto line-clamp-3">
          {stripHtml(description)}
        </p>
      </div>
    </div>
  );
};

export default PodcastHero;
