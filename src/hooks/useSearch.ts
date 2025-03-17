
import { useState, useEffect } from 'react';
import { useWordpressArticles } from '@/hooks/useWordpressArticles';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { decodeHtmlTitle, getFeaturedImageUrl, getArticleSlug } from '@/utils/articleUtils';
import { stripHtml, getPodcastSlug } from '@/utils/podcastUtils';
import { SearchResult } from '@/types/search';

export const useSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Fetch data from different sources
  const { data: articles, isLoading: isLoadingArticles } = useWordpressArticles();
  const { data: podcastData, isLoading: isLoadingPodcasts } = usePodcastFeed();

  useEffect(() => {
    if (query.length >= 2) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query, articles, podcastData]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    const searchResults: SearchResult[] = [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    // Search in WordPress articles
    if (articles) {
      articles.forEach(article => {
        const title = decodeHtmlTitle(article.title.rendered);
        const content = stripHtml(article.content.rendered);
        const excerpt = stripHtml(article.excerpt.rendered);
        
        if (
          title.toLowerCase().includes(lowerCaseQuery) || 
          content.toLowerCase().includes(lowerCaseQuery) ||
          excerpt.toLowerCase().includes(lowerCaseQuery)
        ) {
          searchResults.push({
            id: `article-${article.id}`,
            title: title,
            excerpt: excerpt.substring(0, 150) + "...",
            type: 'article',
            date: article.date || new Date().toISOString(),
            url: `/article/${getArticleSlug(article)}`,
            imageUrl: getFeaturedImageUrl(article)
          });
        }
      });
    }
    
    // Search in podcasts
    if (podcastData?.allEpisodes) {
      podcastData.allEpisodes.forEach((episode, index) => {
        const title = episode.title;
        const description = stripHtml(episode.description || "");
        
        if (
          title.toLowerCase().includes(lowerCaseQuery) || 
          description.toLowerCase().includes(lowerCaseQuery)
        ) {
          const podcastSlug = getPodcastSlug(title);
          searchResults.push({
            id: `podcast-${index}`,
            title: title,
            excerpt: description.substring(0, 150) + "...",
            type: 'podcast',
            date: episode.pubDate,
            url: `/podcast/${podcastSlug}`,
            imageUrl: episode.itunes?.image
          });
        }
      });
    }
    
    setResults(searchResults);
    setIsSearching(false);
  };

  const isLoading = isLoadingArticles || isLoadingPodcasts || isSearching;

  return { results, isLoading };
};
