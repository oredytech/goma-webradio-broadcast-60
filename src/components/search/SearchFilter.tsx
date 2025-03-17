
import React from 'react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Filter } from 'lucide-react';

export type FilterType = 'all' | 'article' | 'podcast';

interface SearchFilterProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  resultsCount: {
    all: number;
    article: number;
    podcast: number;
  };
}

const SearchFilter = ({ selectedFilter, onFilterChange, resultsCount }: SearchFilterProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter size={18} />
        <span>Filtrer par:</span>
      </div>
      
      <ToggleGroup type="single" value={selectedFilter} onValueChange={(value: string) => {
        if (value) onFilterChange(value as FilterType);
      }}>
        <ToggleGroupItem value="all" aria-label="Tous les résultats">
          Tous ({resultsCount.all})
        </ToggleGroupItem>
        <ToggleGroupItem value="article" aria-label="Articles uniquement">
          Articles ({resultsCount.article})
        </ToggleGroupItem>
        <ToggleGroupItem value="podcast" aria-label="Podcasts uniquement">
          Podcasts ({resultsCount.podcast})
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SearchFilter;
