
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "./ArticleFormTypes";

interface ArticlePublishSidebarProps {
  isSubmitting: boolean;
}

const ArticlePublishSidebar = ({ isSubmitting }: ArticlePublishSidebarProps) => {
  const { control, watch } = useFormContext<ArticleFormValues>();
  
  return (
    <div className="lg:w-64 space-y-4">
      <div className="bg-card rounded-lg shadow-md p-4 space-y-4">
        <h3 className="font-medium text-lg">Publication</h3>
        <Separator />
        
        <FormField
          control={control}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Send size={16} />
            )}
            {watch("status") === "publish" ? "Publier sur Telegram" : "Enregistrer sur Telegram"}
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-4 space-y-4">
        <h3 className="font-medium text-lg">Propriétés</h3>
        <Separator />
        
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default ArticlePublishSidebar;
