
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SearchResult } from '@/types/search';
import { getArticleSlug } from '@/utils/articleUtils';
import { getPodcastSlug } from '@/utils/podcastUtils';

interface SearchResultCardProps {
  result: SearchResult;
  searchTerm: string;
  highlightSearchTerm: (text: string, searchTerm: string) => React.ReactNode;
}

const SearchResultCard = ({ result, searchTerm, highlightSearchTerm }: SearchResultCardProps) => {
  // Generate the correct URL based on result type
  const getResultUrl = () => {
    if (result.type === 'article') {
      return `/article/${getArticleSlug({id: parseInt(result.id.split('-')[1]), title: {rendered: result.title}})}`;
    } else {
      return `/podcast/${getPodcastSlug(result.title)}`;
    }
  };

  const resultUrl = getResultUrl();

  return (
    <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow shadow-md hover:shadow-lg dark:shadow-primary/10">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {result.imageUrl && (
            <Link to={resultUrl} className="shrink-0">
              <img 
                src={result.imageUrl} 
                alt={result.title}
                className="h-20 w-20 object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg'; // Fallback image
                }}
              />
            </Link>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                <Link to={resultUrl}>{highlightSearchTerm(result.title, searchTerm)}</Link>
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground dark:text-white uppercase">
                {result.type === 'article' ? 'Article' : 'Podcast'}
              </span>
            </div>
            <p className="text-muted-foreground dark:text-gray-300">
              {typeof result.excerpt === 'string' 
                ? highlightSearchTerm(result.excerpt, searchTerm)
                : result.excerpt}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/10 py-2 px-6">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Publié le: {new Date(result.date).toLocaleDateString('fr-FR')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SearchResultCard;
