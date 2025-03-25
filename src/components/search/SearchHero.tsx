
import React from 'react';
import SearchForm from './SearchForm';

interface SearchHeroProps {
  initialQuery: string;
}

const SearchHero = ({ initialQuery }: SearchHeroProps) => {
  return (
    <section className="bg-accent/80 py-16 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Rechercher sur GOMA WEBRADIO
        </h1>
        <SearchForm initialQuery={initialQuery} />
      </div>
    </section>
  );
};

export default SearchHero;
