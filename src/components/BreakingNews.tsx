import { useWordpressArticles } from '@/hooks/useWordpressArticles';
import { Link } from 'react-router-dom';
import { getArticleSlug } from '@/utils/articleUtils';

interface BreakingNewsProps {
  isScrollingDown: boolean;
}

export default function BreakingNews({ isScrollingDown }: BreakingNewsProps) {
  const { data: articles } = useWordpressArticles();
  
  const latestArticles = articles?.slice(0, 5) || [];
  
  if (latestArticles.length === 0) return null;

  return (
    <div 
      className={`h-[30px] bg-background border-t border-border overflow-hidden flex items-center fixed left-0 right-0 transition-all duration-500 ease-in-out ${
        isScrollingDown ? 'top-0 z-50' : 'top-[64px] z-40'
      }`}
    >
      <div className="flex-shrink-0 h-full bg-red-600 px-4 flex items-center justify-center clip-breaking-news">
        <span className="text-white font-bold text-sm tracking-wide uppercase whitespace-nowrap">
          Breaking News
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-scroll-left flex items-center h-full hover:pause-animation">
          {latestArticles.map((article, index) => (
            <Link
              key={`${article.id}-${index}`}
              to={`/${article.id}/${getArticleSlug(article)}`}
              className="inline-flex items-center px-6 text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap cursor-pointer relative z-10"
              onClick={(e) => e.stopPropagation()}
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
              className="inline-flex items-center px-6 text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap cursor-pointer relative z-10"
              onClick={(e) => e.stopPropagation()}
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
