
import React from 'react';
import { Button } from '@/components/ui/button';

interface PodcastSectionEmptyProps {
  onRetry: () => void;
}

const PodcastSectionEmpty = ({ onRetry }: PodcastSectionEmptyProps) => {
  return (
    <div className="col-span-3 text-center py-8">
      <p className="text-gray-300 mb-4">Aucun podcast disponible pour le moment.</p>
      <Button onClick={onRetry} variant="secondary">
        Réessayer
      </Button>
    </div>
  );
};

export default PodcastSectionEmpty;
