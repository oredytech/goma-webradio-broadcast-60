
import ArticleCommentForm from "./ArticleCommentForm";

interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <main className="lg:col-span-8">
      {/* Article Content */}
      <div 
        className="prose prose-lg prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Comment Form */}
      <ArticleCommentForm />
    </main>
  );
};

export default ArticleContent;
