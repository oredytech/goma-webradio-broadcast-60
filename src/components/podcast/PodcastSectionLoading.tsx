
import React from 'react';

const PodcastSectionLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
          <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
          <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default PodcastSectionLoading;
