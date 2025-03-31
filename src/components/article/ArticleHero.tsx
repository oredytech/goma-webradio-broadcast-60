
import React, { useEffect } from 'react';

interface ArticleHeroProps {
  title: string;
  featuredImageUrl: string;
  description?: string; // We'll keep the prop in the interface for backward compatibility
}

const ArticleHero = ({ title, featuredImageUrl }: ArticleHeroProps) => {
  return (
    <div className="pt-16">
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] pt-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${featuredImageUrl || '/placeholder.svg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        />
        <div className="absolute inset-0 bg-secondary/50 dark:bg-secondary/70" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-3xl text-center mt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHero;
