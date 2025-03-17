
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchHero from '@/components/search/SearchHero';
import SearchResults from '@/components/search/SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { highlightSearchTerm } from '@/utils/searchUtils';
import { FilterType } from '@/components/search/SearchFilter';

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  const { results, isLoading } = useSearch(queryParam);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SearchHero initialQuery={queryParam} />
        <SearchResults 
          isLoading={isLoading} 
          results={results} 
          searchTerm={queryParam}
          highlightSearchTerm={highlightSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
