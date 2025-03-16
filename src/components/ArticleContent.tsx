
import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
  articleId: number;
}

const ArticleContent = ({ content, articleId }: ArticleContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Effet pour traiter les liens internes après le rendu
  useEffect(() => {
    if (!contentRef.current) return;

    // Obtenir tous les liens dans le contenu
    const links = contentRef.current.querySelectorAll('a');
    
    // Parcourir les liens et ajouter target="_blank" aux liens externes
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('/') && !href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [content]);

  return (
    <div>
      {/* Article Content */}
      <div 
        ref={contentRef}
        className="prose prose-lg prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ArticleContent;
