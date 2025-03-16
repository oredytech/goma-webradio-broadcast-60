
import ArticleCommentForm from "./ArticleCommentForm";

interface ArticleContentProps {
  content: string;
  articleId: number;
}

const ArticleContent = ({ content, articleId }: ArticleContentProps) => {
  return (
    <main className="lg:col-span-8">
      {/* Article Content */}
      <div 
        className="prose prose-lg prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Comment Form */}
      <ArticleCommentForm articleId={articleId} />
    </main>
  );
};

export default ArticleContent;
