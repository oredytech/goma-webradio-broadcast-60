
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PodcastEpisodeMetaProps {
  pubDate: string;
  duration?: string;
}

const PodcastEpisodeMeta = ({ pubDate, duration }: PodcastEpisodeMetaProps) => {
  // Format date to French locale
  const formatPubDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-400">{formatPubDate(pubDate)}</span>
      <span className="text-sm text-gray-400">{duration || ''}</span>
    </div>
  );
};

export default PodcastEpisodeMeta;
