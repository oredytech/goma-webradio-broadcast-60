
import { TelegramArticle } from "@/services/telegramService";

interface TelegramArticleContentProps {
  article: TelegramArticle;
  publishedDate: string;
}

const TelegramArticleContent = ({ article, publishedDate }: TelegramArticleContentProps) => {
  return (
    <div className="lg:col-span-8">
      <div className="prose prose-lg max-w-none mb-12 dark:prose-invert">
        {article.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
      
      <div className="bg-secondary/50 dark:bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">À propos de l'article</h2>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="mt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Publié le {new Date(publishedDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Source: <span className="text-primary">Telegram Bot</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramArticleContent;
