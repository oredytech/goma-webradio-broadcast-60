
// Type pour les mises à jour reçues de Telegram
export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name: string;
    };
    date: number;
    text?: string;
    photo?: Array<{
      file_id: string;
      file_unique_id: string;
      file_size: number;
      width: number;
      height: number;
    }>;
    caption?: string;
  };
}

// Type pour les articles du site
export interface TelegramArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  date: string;
}
