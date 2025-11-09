import { useEffect, useRef } from 'react';
import { useWordpressArticles } from './useWordpressArticles';
import { useToast } from '@/hooks/use-toast';

export const useArticleNotifications = () => {
  const { data: articles } = useWordpressArticles();
  const { toast } = useToast();
  const lastArticleIdRef = useRef<number | null>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
        new Notification('📰 Nouvel article - GOMA WEBRADIO', {
          body: articleTitle,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `article-${latestArticle.id}`,
          requireInteraction: false,
        });
      }

      lastArticleIdRef.current = latestArticle.id;
    }
  }, [articles, toast]);
};
