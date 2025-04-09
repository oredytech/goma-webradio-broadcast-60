import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Type, FileImage } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { publishArticleViaTelegram } from "@/services/telegramService";
import { articleSchema, ArticleFormValues } from "./ArticleFormTypes";
import ArticleEditor from "./ArticleEditor";
import ArticlePreview from "./ArticlePreview";
import ArticlePublishSidebar from "./ArticlePublishSidebar";

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
      <FormProvider {...form}>
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
                  
                  <TabsContent value="editor">
                    <ArticleEditor />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="pt-4">
                    <ArticlePreview />
                  </TabsContent>
                </Tabs>
              </div>
              
              <ArticlePublishSidebar isSubmitting={publishMutation.isPending} />
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default ArticleForm;
