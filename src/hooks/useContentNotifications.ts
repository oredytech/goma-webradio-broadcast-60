import { useEffect, useRef } from 'react';
import { useWordpressArticles } from './useWordpressArticles';
import { usePodcastFeed } from './usePodcastFeed';
import { useToast } from '@/hooks/use-toast';

export const useContentNotifications = () => {
  const { data: articles } = useWordpressArticles();
  const { data: podcastData } = usePodcastFeed();
  const { toast } = useToast();
  
  const lastArticleIdRef = useRef<number | null>(null);
  const lastPodcastTitleRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Monitor new articles
  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const latestArticle = articles[0];
    
    // Skip notification on first load
    if (isFirstLoadRef.current) {
      lastArticleIdRef.current = latestArticle.id;
      isFirstLoadRef.current = false;
      return;
    }

    // Check if there's a new article
    if (lastArticleIdRef.current && latestArticle.id !== lastArticleIdRef.current) {
      const articleTitle = latestArticle.title.rendered.replace(/<[^>]*>/g, '');
      
      // Show in-app toast notification
      toast({
        title: "📰 Nouvel article publié",
        description: articleTitle,
      });

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('📰 Nouvel article - GOMA WEBRADIO', {
          body: articleTitle,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `article-${latestArticle.id}`,
          requireInteraction: false,
        });

        // Click handler to open article
        notification.onclick = () => {
          window.focus();
          const slug = latestArticle.link?.split('/').filter(Boolean).pop() || '';
          window.location.href = `/${latestArticle.id}/${slug}`;
        };
      }

      lastArticleIdRef.current = latestArticle.id;
    }
  }, [articles, toast]);

  // Monitor new podcasts
  useEffect(() => {
    if (!podcastData?.allEpisodes || podcastData.allEpisodes.length === 0) return;

    const latestPodcast = podcastData.allEpisodes[0];
    
    // Skip notification on first load
    if (isFirstLoadRef.current) {
      lastPodcastTitleRef.current = latestPodcast.title;
      return;
    }

    // Check if there's a new podcast
    if (lastPodcastTitleRef.current && latestPodcast.title !== lastPodcastTitleRef.current) {
      const podcastTitle = latestPodcast.title;
      
      // Show in-app toast notification
      toast({
        title: "🎙️ Nouveau podcast disponible",
        description: podcastTitle,
      });

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('🎙️ Nouveau podcast - GOMA WEBRADIO', {
          body: podcastTitle,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `podcast-${Date.now()}`,
          requireInteraction: false,
        });

        // Click handler to open podcasts page
        notification.onclick = () => {
          window.focus();
          window.location.href = '/podcasts';
        };
      }

      lastPodcastTitleRef.current = latestPodcast.title;
    }
  }, [podcastData, toast]);
};
