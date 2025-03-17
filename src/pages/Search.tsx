
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

const formSchema = z.object({
  query: z.string().min(2, {
    message: "La recherche doit contenir au moins 2 caractères.",
  }),
});

// Mock search results for demonstration
const mockResults = [
  {
    id: 1,
    title: "La situation sécuritaire à Goma",
    excerpt: "Une analyse détaillée de la situation sécuritaire actuelle dans la ville de Goma et ses environs...",
    type: "article",
    date: "2023-11-10",
    url: "/article/situation-securitaire-goma"
  },
  {
    id: 2,
    title: "Interview exclusive avec le gouverneur du Nord-Kivu",
    excerpt: "Le gouverneur s'exprime sur les défis et les perspectives de développement pour la province...",
    type: "podcast",
    date: "2023-10-25",
    url: "/podcast/interview-gouverneur-nord-kivu"
  },
  {
    id: 3,
    title: "Les enjeux économiques dans l'Est de la RDC",
    excerpt: "Analyse des opportunités et défis économiques dans la région Est de la République Démocratique du Congo...",
    type: "article",
    date: "2023-09-15",
    url: "/article/enjeux-economiques-est-rdc"
  },
];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: queryParam,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    navigate(`/recherche?q=${encodeURIComponent(values.query)}`);
  };

  useEffect(() => {
    if (queryParam.length >= 2) {
      performSearch(queryParam);
    } else {
      setResults([]);
    }
  }, [queryParam]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on query
      const filteredResults = mockResults.filter(
        item => item.title.toLowerCase().includes(query.toLowerCase()) || 
               item.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="pt-28 pb-16">
      {/* Hero section with search form */}
      <section className="bg-secondary/80 py-16 px-4">
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
      <section className="max-w-4xl mx-auto mt-10 px-4">
        {queryParam.length >= 2 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {isSearching ? 'Recherche en cours...' : 
                results.length === 0 ? 'Aucun résultat trouvé' : 
                `Résultats pour "${queryParam}" (${results.length})`}
            </h2>
            <div className="h-1 w-20 bg-primary"></div>
          </div>
        )}

        <div className="space-y-6">
          {isSearching ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-md p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            // Results
            results.map((result) => (
              <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      <a href={result.url}>{result.title}</a>
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-white uppercase">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{result.excerpt}</p>
                </CardContent>
                <CardFooter className="bg-secondary/10 py-2 px-6">
                  <div className="text-sm text-muted-foreground">
                    Publié le: {result.date}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
