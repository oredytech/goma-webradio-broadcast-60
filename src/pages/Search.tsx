
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWordpressArticles } from '@/hooks/useWordpressArticles';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { decodeHtmlTitle, getFeaturedImageUrl } from '@/utils/articleUtils';
import { stripHtml } from '@/utils/podcastUtils';

const formSchema = z.object({
  query: z.string().min(2, {
    message: "La recherche doit contenir au moins 2 caractères.",
  }),
});

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'podcast';
  date: string;
  url: string;
  imageUrl?: string;
}

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: queryParam,
    },
  });

  // Fetch data from different sources
  const { data: articles, isLoading: isLoadingArticles } = useWordpressArticles();
  const { data: podcastData, isLoading: isLoadingPodcasts } = usePodcastFeed();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    navigate(`/recherche?q=${encodeURIComponent(values.query)}`);
  };

  useEffect(() => {
    if (queryParam.length >= 2) {
      performSearch(queryParam);
    } else {
      setResults([]);
    }
  }, [queryParam, articles, podcastData]);

  // Highlight search term in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200 font-medium">{part}</mark> 
        : part
    );
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    const searchResults: SearchResult[] = [];
    const lowerCaseQuery = query.toLowerCase();
    
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
            url: `/article/${article.id}`,
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
          searchResults.push({
            id: `podcast-${index}`,
            title: title,
            excerpt: description.substring(0, 150) + "...",
            type: 'podcast',
            date: episode.pubDate,
            url: `/podcast/${index}`,
            imageUrl: episode.itunes?.image
          });
        }
      });
    }
    
    setResults(searchResults);
    setIsSearching(false);
  };

  const isLoading = isLoadingArticles || isLoadingPodcasts || isSearching;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero section with search form */}
        <section className="bg-secondary/80 py-16 px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Rechercher sur GOMA WEBRADIO
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex sm:flex-row flex-col gap-2 max-w-2xl mx-auto">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Que recherchez-vous ?" 
                            className="w-full h-12 text-base" 
                            {...field} 
                            autoFocus
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    <SearchIcon className="mr-2 h-5 w-5" />
                    Rechercher
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>

        {/* Results section */}
        <section className="max-w-4xl mx-auto my-10 px-4">
          {queryParam.length >= 2 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {isLoading ? 'Recherche en cours...' : 
                  results.length === 0 ? 'Aucun résultat trouvé' : 
                  `Résultats pour "${queryParam}" (${results.length})`}
              </h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
          )}

          <div className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Results
              results.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {result.imageUrl && (
                        <a href={result.url} className="shrink-0">
                          <img 
                            src={result.imageUrl} 
                            alt={result.title}
                            className="h-20 w-20 object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg'; // Fallback image
                            }}
                          />
                        </a>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            <a href={result.url}>{highlightSearchTerm(result.title, queryParam)}</a>
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-white uppercase">
                            {result.type === 'article' ? 'Article' : 'Podcast'}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {typeof result.excerpt === 'string' 
                            ? highlightSearchTerm(result.excerpt, queryParam)
                            : result.excerpt}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-secondary/10 py-2 px-6">
                    <div className="text-sm text-muted-foreground">
                      Publié le: {new Date(result.date).toLocaleDateString('fr-FR')}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
