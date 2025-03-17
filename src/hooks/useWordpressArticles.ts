
import { useQuery } from "@tanstack/react-query";

interface WordPressArticle {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  link: string;
  date: string; // Adding the date property that was missing
}

const fetchArticles = async () => {
  const response = await fetch(
    "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useWordpressArticles = () => {
  return useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: fetchArticles,
  });
};

export type { WordPressArticle };
