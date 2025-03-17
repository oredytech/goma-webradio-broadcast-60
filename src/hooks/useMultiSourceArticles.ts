
import { useQueries } from "@tanstack/react-query";

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
  link: string;
  date: string; // Adding the missing date property
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  // Optional featured_media for compatibility with useWordpressArticles type
  featured_media?: number;
}

const sources = [
  {
    id: "totalementactus",
    url: "https://totalementactus.net/wp-json/wp/v2/posts",
    name: "Totalement Actus"
  }
];

const fetchArticles = async (source: string) => {
  const response = await fetch(`${source}?_embed&per_page=30`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useMultiSourceArticles = () => {
  return useQueries({
    queries: sources.map((source) => ({
      queryKey: ["articles", source.id],
      queryFn: () => fetchArticles(source.url),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });
};

export type { WordPressArticle };
export { sources };
