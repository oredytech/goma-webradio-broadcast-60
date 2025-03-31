
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import ArticleSocialActions from "@/components/ArticleSocialActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleContentProps {
  article: WordPressArticle;
}

const ArticleContent = ({ article }: ArticleContentProps) => {
  // Format the publication date
  const formattedDate = article.date 
    ? format(new Date(article.date), "dd MMMM yyyy", { locale: fr })
    : "";
    
  // Get author avatar URL - use the largest size available or fallback to placeholder
  const avatarUrl = article._embedded?.author?.[0]?.avatar_urls?.["96"] || 
                    article._embedded?.author?.[0]?.avatar_urls?.["48"] || 
                    article._embedded?.author?.[0]?.avatar_urls?.["24"] || 
                    "/placeholder.svg";

  return (
    <div className="lg:col-span-8">
      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none mb-12 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content.rendered }}
      />

      {/* Author Information */}
      <div className="bg-secondary/50 dark:bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">À propos de l'article</h2>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-full border-2 border-primary">
            <AvatarImage src={avatarUrl} alt={`Avatar de ${article._embedded?.author?.[0]?.name || "l'auteur"}`} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              {article._embedded?.author?.[0]?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              {article._embedded?.author?.[0]?.name || "Auteur Inconnu"}
            </h3>
            <div className="mt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Publié le {formattedDate}
              </p>
              <p className="text-sm text-muted-foreground">
                Source: <span className="text-primary">Totalement Actus</span>
              </p>
              {article._embedded?.author?.[0]?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {article._embedded?.author?.[0]?.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleContent;
