
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PodcastSectionFooter = () => {
  return (
    <div className="text-center mt-12">
      <Button asChild variant="secondary" className="px-8 py-6 text-lg">
        <Link to="/podcasts">
          Voir tous nos podcasts
        </Link>
      </Button>
    </div>
  );
};

export default PodcastSectionFooter;
