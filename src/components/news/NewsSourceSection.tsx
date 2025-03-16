
import { WordPressArticle } from "@/hooks/useMultiSourceArticles";
import NewsCard from "./NewsCard";

interface NewsSourceSectionProps {
  sourceName: string;
  articles: WordPressArticle[];
}

const NewsSourceSection = ({ sourceName, articles }: NewsSourceSectionProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">{sourceName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article: WordPressArticle) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsSourceSection;
