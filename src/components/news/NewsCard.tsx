
import { Link } from "react-router-dom";
import { WordPressArticle } from "@/hooks/useMultiSourceArticles";
import { createSlug, decodeHtmlTitle } from "@/utils/articleUtils";

interface NewsCardProps {
  article: WordPressArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const decodedTitle = decodeHtmlTitle(article.title.rendered);
  const articleSlug = createSlug(decodedTitle);
  
  return (
    <Link
      to={`/article/${articleSlug}`}
      className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 group animate-fade-in"
    >
      {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article._embedded["wp:featuredmedia"][0].source_url}
            alt={article.title.rendered}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3
          className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors"
          dangerouslySetInnerHTML={{ __html: article.title.rendered }}
        />
        <div
          className="text-gray-300 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
        />
      </div>
    </Link>
  );
};

export default NewsCard;
