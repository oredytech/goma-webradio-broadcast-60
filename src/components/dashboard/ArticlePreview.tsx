
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { FileImage } from "lucide-react";
import { ArticleFormValues } from "./ArticleFormTypes";

const renderMarkdown = (markdown: string) => {
  // Basic markdown parser
  let html = markdown;
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Ordered lists
  html = html.replace(/^(\d+\.\s+.*?)(?:\n|$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>\d+\.\s+.*?<\/li>)+/g, '<ol>$&</ol>');
  
  // Unordered lists
  html = html.replace(/^(-\s+.*?)(?:\n|$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>-\s+.*?<\/li>)+/g, '<ul>$&</ul>');
  
  // Replace remaining newlines with paragraphs
  html = html.replace(/^((?!<[ou]l>|<\/[ou]l>|<li>|<\/li>).*?)(?:\n|$)/gm, '<p>$1</p>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
};

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
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(watch("content")) }}
            />
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
