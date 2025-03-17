
import { useEffect, useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { usePodcastFeed } from "@/hooks/usePodcastFeed";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticleSlug } from "@/utils/articleUtils";
import { getPodcastSlug } from "@/utils/podcastUtils";

const NotFound = () => {
  const location = useLocation();
  const { data: articles, isLoading: articlesLoading } = useWordpressArticles();
  const { data: podcastData, isLoading: podcastsLoading } = usePodcastFeed();
  const [matchedArticle, setMatchedArticle] = useState<WordPressArticle | null>(null);
  const [matchedPodcastInfo, setMatchedPodcastInfo] = useState<{ index: number; slug: string } | null>(null);
  const [possibleMatches, setPossibleMatches] = useState<{articles: WordPressArticle[], podcasts: {index: number, title: string, slug: string}[]}>({
    articles: [],
    podcasts: []
  });

  useEffect(() => {
    // Check for article paths
    if (articles && !articlesLoading) {
      const articleMatch = location.pathname.match(/\/article\/(.+)/);
      if (articleMatch) {
        const pathSegment = articleMatch[1];
        
        // Check if it's just a numeric ID (old format)
        const isJustId = /^\d+$/.test(pathSegment);
        if (isJustId) {
          const id = parseInt(pathSegment);
          const article = articles.find(a => a.id === id);
          if (article) {
            setMatchedArticle(article);
            return;
          }
        }
        
        // Try to match by title/slug
        const article = articles.find(a => {
          const slug = getArticleSlug(a);
          return pathSegment === slug || 
                 pathSegment.includes(slug) || 
                 slug.includes(pathSegment);
        });
        
        if (article) {
          setMatchedArticle(article);
          return;
        }

        // If no exact match, collect possible matches for suggestions
        const possibleArticleMatches = articles.filter(a => {
          const decodedTitle = new DOMParser().parseFromString(a.title.rendered, 'text/html').body.textContent || a.title.rendered;
          return decodedTitle.toLowerCase().includes(pathSegment.toLowerCase()) ||
                 pathSegment.toLowerCase().includes(decodedTitle.toLowerCase().substring(0, 5));
        }).slice(0, 3); // Limit to 3 suggestions
        
        setPossibleMatches(prev => ({...prev, articles: possibleArticleMatches}));
      }
    }

    // Check for podcast paths
    if (podcastData && !podcastsLoading) {
      // Match both old format with ID and new format without ID
      const podcastMatch = location.pathname.match(/\/podcast\/(?:(\d+)\/)?(.+)?/);
      if (podcastMatch) {
        const idStr = podcastMatch[1];
        const slug = podcastMatch[2] || (idStr && !podcastMatch[2] ? idStr : null);
        
        if (slug) {
          // Get all episodes from all feeds
          const allEpisodes = podcastData.allEpisodes;
          
          // Try to find matching podcast by slug
          const podcastIndex = allEpisodes.findIndex(episode => {
            const episodeSlug = getPodcastSlug(episode.title);
            return slug === episodeSlug || 
                   slug.includes(episodeSlug) || 
                   episodeSlug.includes(slug);
          });
          
          if (podcastIndex !== -1) {
            const episode = allEpisodes[podcastIndex];
            const generatedSlug = getPodcastSlug(episode.title);
            
            setMatchedPodcastInfo({
              index: podcastIndex,
              slug: generatedSlug
            });
            return;
          }

          // If no exact match, collect possible matches for suggestions
          const possiblePodcastMatches = allEpisodes
            .map((episode, index) => ({
              index,
              title: episode.title,
              slug: getPodcastSlug(episode.title)
            }))
            .filter(p => 
              p.title.toLowerCase().includes(slug.toLowerCase()) ||
              slug.toLowerCase().includes(p.title.toLowerCase().substring(0, 5))
            )
            .slice(0, 3); // Limit to 3 suggestions
          
          setPossibleMatches(prev => ({...prev, podcasts: possiblePodcastMatches}));
        }
      }
    }
  }, [articles, articlesLoading, location.pathname, podcastData, podcastsLoading]);

  if (articlesLoading || podcastsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // If we matched an article, redirect to the proper article URL
  if (matchedArticle) {
    const articleSlug = getArticleSlug(matchedArticle);
    return <Navigate to={`/article/${articleSlug}`} replace />;
  }

  // If we matched a podcast, redirect to the proper podcast URL
  if (matchedPodcastInfo) {
    return <Navigate to={`/podcast/${matchedPodcastInfo.slug}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Page non trouvée</h1>
          <p className="text-gray-300 text-lg mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          {/* Suggestions for similar content */}
          {(possibleMatches.articles.length > 0 || possibleMatches.podcasts.length > 0) && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Contenu suggéré</h2>
              
              {possibleMatches.articles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Articles</h3>
                  <div className="flex flex-col space-y-2">
                    {possibleMatches.articles.map(article => (
                      <Link 
                        key={article.id}
                        to={`/article/${getArticleSlug(article)}`}
                        className="text-primary hover:underline"
                        dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {possibleMatches.podcasts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Podcasts</h3>
                  <div className="flex flex-col space-y-2">
                    {possibleMatches.podcasts.map(podcast => (
                      <Link 
                        key={podcast.index}
                        to={`/podcast/${podcast.slug}`}
                        className="text-primary hover:underline"
                      >
                        {podcast.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Link to="/">
            <Button className="mt-6">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
