
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "./ArticleFormTypes";

const ArticleEditor = () => {
  const { control } = useFormContext<ArticleFormValues>();
  
  return (
    <div className="space-y-4 pt-4">
      <FormField
        control={control}
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
        control={control}
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
    </div>
  );
};

export default ArticleEditor;
