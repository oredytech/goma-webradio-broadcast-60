
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import ArticleMetaTags from "@/components/ArticleMetaTags";
import ArticleHero from "@/components/ArticleHero";
import ArticleContent from "@/components/ArticleContent";
import ArticleSidebar from "@/components/ArticleSidebar";
import ArticleSocialActions from "@/components/ArticleSocialActions";
import ArticleCommentForm from "@/components/ArticleCommentForm";
import ArticleCommentsList from "@/components/ArticleCommentsList";
import ExtraArticles from "@/components/ExtraArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { decodeHtmlTitle, extractMetaDescription } from "@/utils/articleUtils";

interface ArticleMainContentProps {
  article: WordPressArticle;
  commentsUpdated: boolean;
  onCommentAdded: () => void;
}

const ArticleMainContent = ({ 
  article,
  commentsUpdated,
  onCommentAdded
}: ArticleMainContentProps) => {
  const featuredImageUrl = article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';
  const decodedTitle = decodeHtmlTitle(article.title.rendered);
  const metaDescription = extractMetaDescription(article.excerpt.rendered);
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <ArticleMetaTags 
        title={decodedTitle}
        description={metaDescription}
        imageUrl={featuredImageUrl}
        url={currentUrl}
      />
      
      <Header />
      <ArticleHero title={decodedTitle} imageUrl={featuredImageUrl} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ArticleContent content={article.content.rendered} articleId={article.id} />
            
            <div className="my-8">
              <ArticleSocialActions articleId={article.id} />
            </div>

            <div className="mt-12">
              <ArticleCommentForm 
                articleId={article.id} 
                onCommentAdded={onCommentAdded}
              />
              <ArticleCommentsList 
                articleId={article.id}
                commentsUpdated={commentsUpdated}
              />
            </div>
          </div>
          <ArticleSidebar />
        </div>
      </div>

      <ExtraArticles />
      <Footer />
    </div>
  );
};

export default ArticleMainContent;
