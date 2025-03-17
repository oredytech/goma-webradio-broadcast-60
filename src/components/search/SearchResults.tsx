
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SearchResultCard from './SearchResultCard';
import { SearchResult } from '@/types/search';

interface SearchResultsProps {
  isLoading: boolean;
  results: SearchResult[];
  searchTerm: string;
  highlightSearchTerm: (text: string, searchTerm: string) => React.ReactNode;
}

const SearchResults = ({ isLoading, results, searchTerm, highlightSearchTerm }: SearchResultsProps) => {
  return (
    <section className="max-w-4xl mx-auto my-10 px-4">
      {searchTerm.length >= 2 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {isLoading ? 'Recherche en cours...' : 
              results.length === 0 ? 'Aucun résultat trouvé' : 
              `Résultats pour "${searchTerm}" (${results.length})`}
          </h2>
          <div className="h-1 w-20 bg-primary"></div>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : (
          // Results
          results.map((result) => (
            <SearchResultCard 
              key={result.id}
              result={result} 
              searchTerm={searchTerm}
              highlightSearchTerm={highlightSearchTerm}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default SearchResults;
