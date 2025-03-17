
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const formSchema = z.object({
  query: z.string().min(2, {
    message: "La recherche doit contenir au moins 2 caractères.",
  }),
});

interface SearchFormProps {
  initialQuery: string;
}

const SearchForm = ({ initialQuery }: SearchFormProps) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    navigate(`/recherche?q=${encodeURIComponent(values.query)}`);
  };

  return (
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
  );
};

export default SearchForm;
