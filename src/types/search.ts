
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'podcast';
  date: string;
  url: string;
  imageUrl?: string;
}
