import { useQueries } from "@tanstack/react-query";

interface WordPressArticle {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

const sources = [
  {
    id: "aupicinfo",
    url: "https://aupicinfo.com/wp-json/wp/v2/posts",
    name: "Aupic Info"
  },
  {
    id: "kivureporter",
    url: "https://kivureporter.net/wp-json/wp/v2/posts",
    name: "Kivu Reporter"
  },
  {
    id: "kivu7",
    url: "https://kivu7.net/wp-json/wp/v2/posts",
    name: "Kivu7"
  }
];

const fetchArticles = async (source: string) => {
  const response = await fetch(`${source}?_embed&per_page=5`);
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