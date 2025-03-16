
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import ArticleSocialActions from "@/components/ArticleSocialActions";

interface ArticleContentProps {
  article: WordPressArticle;
}

const ArticleContent = ({ article }: ArticleContentProps) => {
  return (
    <div className="lg:col-span-8">
      {/* Article Content */}
      <div 
        className="prose prose-lg prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content.rendered }}
      />

      {/* Comment Form */}
      <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-6">Laissez un commentaire</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("Commentaire soumis");
        }} className="space-y-4">
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full px-4 py-2 bg-white/10 border border-primary/20 rounded-md text-white placeholder:text-white/50"
          />
          <input
            type="email"
            placeholder="Votre email"
            className="w-full px-4 py-2 bg-white/10 border border-primary/20 rounded-md text-white placeholder:text-white/50"
          />
          <textarea
            placeholder="Votre commentaire"
            className="w-full px-4 py-2 bg-white/10 border border-primary/20 rounded-md text-white placeholder:text-white/50 min-h-[150px]"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md w-full sm:w-auto">
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleContent;
