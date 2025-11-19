
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Type, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { articleSchema, ArticleFormValues } from "./ArticleFormTypes";
import ArticleEditor from "./ArticleEditor";
import ArticlePreview from "./ArticlePreview";
import ArticlePublishSidebar from "./ArticlePublishSidebar";

const ArticleForm = () => {
  const [previewMode, setPreviewMode] = useState<"editor" | "preview">("editor");
  const { toast } = useToast();

  // Initialiser le formulaire avec les valeurs par défaut
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      featuredImage: "",
      status: "draft",
      uploadedImage: undefined
    }
  });

  const onSubmit = (data: ArticleFormValues) => {
    toast({
      title: "Fonctionnalité désactivée",
      description: "La création d'articles est temporairement désactivée",
      variant: "destructive",
    });
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
                        <Image size={16} />
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
              
              <ArticlePublishSidebar isSubmitting={false} />
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default ArticleForm;
