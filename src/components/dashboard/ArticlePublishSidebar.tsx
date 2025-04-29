
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Send, Upload, FileImage } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "./ArticleFormTypes";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ArticlePublishSidebarProps {
  isSubmitting: boolean;
}

const ArticlePublishSidebar = ({ isSubmitting }: ArticlePublishSidebarProps) => {
  const { control, watch, setValue } = useFormContext<ArticleFormValues>();
  const [imageUploading, setImageUploading] = useState(false);
  const { toast } = useToast();
  
  // Fonction pour gérer le téléversement d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Image trop volumineuse",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setImageUploading(true);
    
    // Créer une URL locale pour l'image (preview)
    const localImageUrl = URL.createObjectURL(file);
    
    // Mise à jour du champ featuredImage avec l'URL locale
    setValue("featuredImage", localImageUrl);
    setValue("uploadedImage", file); // Stocker le fichier pour l'envoi ultérieur
    
    setImageUploading(false);
    
    toast({
      title: "Image ajoutée",
      description: "L'image a été sélectionnée pour l'article",
    });
  };
  
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
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="URL de l'image"
                      {...field}
                      className="flex-1"
                    />
                    <div className="relative">
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="aspect-square"
                        disabled={imageUploading}
                      >
                        {imageUploading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Upload size={16} />
                        )}
                        <span className="sr-only">Téléverser une image</span>
                      </Button>
                      <Input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Entrez une URL ou téléversez une image locale (max 5MB)
                  </p>
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
