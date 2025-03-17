
import React from 'react';

// Highlight search term in text
export const highlightSearchTerm = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === searchTerm.toLowerCase() 
      ? <mark key={index} className="bg-yellow-200 font-medium">{part}</mark> 
      : part
  );
};
