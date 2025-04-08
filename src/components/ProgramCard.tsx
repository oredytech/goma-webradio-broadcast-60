
import React from 'react';

interface ProgramCardProps {
  title: string;
  description: string;
  image: string;
  time: string;
}

const ProgramCard = ({ title, description, image, time }: ProgramCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Program image failed to load:", image);
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  // S'assurer que l'URL de l'image est absolue pour le partage
  const getAbsoluteImageUrl = (url: string): string => {
    if (!url) return `${window.location.origin}/placeholder.svg`;
    
    // Si l'URL est déjà absolue, la retourner
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Sinon, ajouter l'origine
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-primary/20">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <span className="text-primary text-sm font-medium">{time}</span>
        <h3 className="text-xl font-bold text-white mt-2">{title}</h3>
        <p className="text-gray-300 mt-2 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ProgramCard;
