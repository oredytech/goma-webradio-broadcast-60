import { useWordpressArticles } from '@/hooks/useWordpressArticles';
import { Link } from 'react-router-dom';
import { getArticleSlug } from '@/utils/articleUtils';

export default function BreakingNews() {
  const { data: articles } = useWordpressArticles();
  
  const latestArticles = articles?.slice(0, 5) || [];
  
  if (latestArticles.length === 0) return null;

  return (
    <div className="h-[30px] bg-background border-t border-border overflow-hidden flex items-center">
      <div className="flex-shrink-0 h-full bg-red-600 px-4 flex items-center justify-center clip-breaking-news">
        <span className="text-white font-bold text-sm tracking-wide uppercase whitespace-nowrap">
          Breaking News
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-scroll-left flex items-center h-full">
          {latestArticles.map((article, index) => (
            <Link
              key={`${article.id}-${index}`}
              to={`/${article.id}/${getArticleSlug(article)}`}
              className="inline-flex items-center px-6 text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
            </Link>
          ))}
          {/* Duplicate for seamless loop */}
          {latestArticles.map((article, index) => (
            <Link
              key={`${article.id}-dup-${index}`}
              to={`/${article.id}/${getArticleSlug(article)}`}
              className="inline-flex items-center px-6 text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
