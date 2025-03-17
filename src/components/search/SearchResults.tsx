
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SearchResultCard from './SearchResultCard';
import { SearchResult } from '@/types/search';
import SearchFilter, { FilterType } from './SearchFilter';

interface SearchResultsProps {
  isLoading: boolean;
  results: SearchResult[];
  searchTerm: string;
  highlightSearchTerm: (text: string, searchTerm: string) => React.ReactNode;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const SearchResults = ({ 
  isLoading, 
  results, 
  searchTerm, 
  highlightSearchTerm,
  selectedFilter,
  onFilterChange 
}: SearchResultsProps) => {
  
  // Filter results based on the selected filter
  const filteredResults = selectedFilter === 'all' 
    ? results 
    : results.filter(result => result.type === selectedFilter);

  // Calculate counts for each type
  const resultCounts = {
    all: results.length,
    article: results.filter(r => r.type === 'article').length,
    podcast: results.filter(r => r.type === 'podcast').length
  };

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

      {!isLoading && results.length > 0 && (
        <SearchFilter 
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          resultsCount={resultCounts}
        />
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
          filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <SearchResultCard 
                key={result.id}
                result={result} 
                searchTerm={searchTerm}
                highlightSearchTerm={highlightSearchTerm}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Aucun résultat ne correspond au filtre sélectionné.
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default SearchResults;
