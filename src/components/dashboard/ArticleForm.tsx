import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Save, FileImage, Link, ListChecks, Type } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { publishArticleViaTelegram } from "@/services/telegramService";

// Schéma de validation pour le formulaire
const articleSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  content: z.string().min(50, { message: "Le contenu doit contenir au moins 50 caractères" }),
  excerpt: z.string().min(10, { message: "L'extrait doit contenir au moins 10 caractères" }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  featuredImage: z.string().url({ message: "L'URL de l'image doit être valide" }).optional().or(z.literal("")),
  status: z.enum(["draft", "publish"], { message: "Le statut doit être brouillon ou publié" })
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const ArticleForm = () => {
  const [previewMode, setPreviewMode] = useState<"editor" | "preview">("editor");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialiser le formulaire avec les valeurs par défaut
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      featuredImage: "",
      status: "draft"
    }
  });

  // Mutation pour publier/enregistrer l'article
  const publishMutation = useMutation({
    mutationFn: async (article: ArticleFormValues) => {
      // Publier sur Telegram
      const telegramPublished = await publishArticleViaTelegram(
        article.title,
        article.content,
        article.featuredImage || undefined
      );
      
      if (!telegramPublished) {
        throw new Error("Échec de la publication sur Telegram");
      }
      
      // Simulation d'un appel API pour la compatibilité avec le code existant
      console.log("Article publié sur Telegram:", article);
      
      return { id: Math.floor(Math.random() * 10000) };
    },
    onSuccess: () => {
      toast({
        title: "Article enregistré avec succès",
        description: form.getValues("status") === "publish" 
          ? "L'article a été publié sur Telegram" 
          : "L'article a été enregistré comme brouillon sur Telegram",
      });
      form.reset();
      // Invalidate telegram-articles query to refresh the articles list
      queryClient.invalidateQueries({ queryKey: ["telegram-articles"] });
      // Keep compatibility with existing code
      queryClient.invalidateQueries({ queryKey: ["wordpress-articles"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Gérer la soumission du formulaire
  const onSubmit = (data: ArticleFormValues) => {
    publishMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 space-y-4">
              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "editor" | "preview")}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Nouvel article</h2>
                  <TabsList className="bg-muted/30">
                    <TabsTrigger value="editor" className="flex items-center gap-1">
                      <Type size={16} />
                      Éditeur
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-1">
                      <FileImage size={16} />
                      Aperçu
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="editor" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Titre de l'article" {...field} className="text-lg font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenu</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contenu de l'article..."
                            {...field}
                            className="min-h-[400px] resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="pt-4">
                  <Card className="bg-card dark:bg-background">
                    <CardContent className="pt-6">
                      {form.watch("title") ? (
                        <>
                          <h1 className="text-3xl font-bold text-foreground mb-4">
                            {form.watch("title")}
                          </h1>
                          
                          {form.watch("featuredImage") && (
                            <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
                              <img
                                src={form.watch("featuredImage")}
                                alt={form.watch("title")}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/600x400/a6bddb/143059?text=Image+non+disponible';
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="prose prose-lg max-w-none dark:prose-invert">
                            {form.watch("content").split('\n').map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileImage size={48} className="mx-auto mb-4 opacity-20" />
                          <p>Ajoutez du contenu pour voir l'aperçu</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:w-64 space-y-4">
              <div className="bg-card rounded-lg shadow-md p-4 space-y-4">
                <h3 className="font-medium text-lg">Publication</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="publish">Publié</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    className="gap-2"
                    disabled={publishMutation.isPending}
                  >
                    {publishMutation.isPending ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Save size={16} />
                    )}
                    {form.watch("status") === "publish" ? "Publier" : "Enregistrer"}
                  </Button>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-md p-4 space-y-4">
                <h3 className="font-medium text-lg">Propriétés</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actualites">Actualités</SelectItem>
                            <SelectItem value="politique">Politique</SelectItem>
                            <SelectItem value="societe">Société</SelectItem>
                            <SelectItem value="culture">Culture</SelectItem>
                            <SelectItem value="sport">Sport</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image à la une</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="URL de l'image"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-2 relative w-full h-24 overflow-hidden rounded border border-border">
                          <img
                            src={field.value}
                            alt="Aperçu"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400/a6bddb/143059?text=Image+non+disponible';
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extrait</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bref résumé de l'article..."
                          {...field}
                          className="min-h-[100px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;
