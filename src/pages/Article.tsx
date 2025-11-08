
import { useArticleFinder } from "@/hooks/useArticleFinder";
import { extractArticleData } from "@/utils/articleDataUtils";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ArticleLoading from "@/components/article/ArticleLoading";
import ArticleNotFound from "@/components/article/ArticleNotFound";
import ArticleMetaTags from "@/components/article/ArticleMetaTags";
import ExtraArticles from "@/components/ExtraArticles";
import { WordPressArticle } from "@/hooks/useWordpressArticles";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  // Use the article finder hook to locate the article based on URL params
  const { article, articleSource, isLoading } = useArticleFinder();
  
  // Handle loading state
  if (isLoading) {
    return <ArticleLoading />;
  }

  // Handle not found state
  if (!article && !isLoading) {
    return <ArticleNotFound />;
  }

  if (!article) return null;

  // Extract consistent article data regardless of source
  const articleData = extractArticleData(article, articleSource);
  
  if (!articleData) return null;
  
  const { title, featuredImageUrl, description, publishedDate } = articleData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      {/* Meta tags for SEO */}
      <ArticleMetaTags article={article} articleSource={articleSource} />
      
      <ArticleHero 
        title={title} 
        featuredImageUrl={featuredImageUrl}
        description={description}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ArticleContent article={article as WordPressArticle} />
          <ArticleSidebar />
        </div>
      </div>

      <ExtraArticles />
    </div>
  );
};

export default Article;
