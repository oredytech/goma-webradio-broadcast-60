
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { FileImage } from "lucide-react";
import { ArticleFormValues } from "./ArticleFormTypes";

const ArticlePreview = () => {
  const { watch } = useFormContext<ArticleFormValues>();
  
  return (
    <Card className="bg-card dark:bg-background">
      <CardContent className="pt-6">
        {watch("title") ? (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {watch("title")}
            </h1>
            
            {watch("featuredImage") && (
              <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
                <img
                  src={watch("featuredImage")}
                  alt={watch("title")}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/a6bddb/143059?text=Image+non+disponible';
                  }}
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {watch("content").split('\n').map((paragraph, idx) => (
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
  );
};

export default ArticlePreview;
