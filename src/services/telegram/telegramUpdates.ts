
import { getTelegramApiBaseUrl, getTelegramBotToken } from './telegramConfig';
import { TelegramUpdate, TelegramArticle } from './telegramTypes';

// Récupérer les mises à jour du bot
export const getUpdates = async (offset?: number): Promise<TelegramUpdate[]> => {
  try {
    const apiBaseUrl = getTelegramApiBaseUrl();
    const params = new URLSearchParams();
    if (offset) {
      params.append("offset", offset.toString());
    }

    const response = await fetch(`${apiBaseUrl}/getUpdates?${params.toString()}`);
    const data = await response.json();

    if (data.ok) {
      return data.result;
    }
    console.error("Erreur lors de la récupération des mises à jour:", data.description);
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des mises à jour de Telegram:", error);
    return [];
  }
};

// Récupérer l'URL d'une image Telegram par son file_id
export const getFileUrl = async (fileId: string): Promise<string> => {
  try {
    const apiBaseUrl = getTelegramApiBaseUrl();
    const token = getTelegramBotToken();
    
    const response = await fetch(`${apiBaseUrl}/getFile?file_id=${fileId}`);
    const data = await response.json();

    if (data.ok) {
      return `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
    }
    console.error("Erreur lors de la récupération de l'URL du fichier:", data.description);
    return "";
  } catch (error) {
    console.error("Erreur lors de la récupération de l'URL du fichier Telegram:", error);
    return "";
  }
};

// Parser les mises à jour en articles
export const parseUpdatesToArticles = async (updates: TelegramUpdate[]): Promise<TelegramArticle[]> => {
  const articles: TelegramArticle[] = [];
  
  for (const update of updates) {
    if (update.message) {
      // Messages avec texte uniquement
      if (update.message.text && !update.message.photo) {
        const parts = update.message.text.split("\n\n");
        if (parts.length >= 2) {
          const title = parts[0].replace(/^<b>(.*)<\/b>$/i, '$1'); // Supprimer les balises HTML
          const content = parts.slice(1).join("\n\n");
          
          articles.push({
            id: update.message.message_id,
            title: title,
            content: content,
            excerpt: content.substring(0, 150) + "...",
            featuredImage: "",
            date: new Date(update.message.date * 1000).toISOString(),
          });
        }
      }
      
      // Messages avec photo
      if (update.message.photo && update.message.photo.length > 0) {
        const largestPhoto = update.message.photo[update.message.photo.length - 1];
        const photoUrl = await getFileUrl(largestPhoto.file_id);
        
        let title = "";
        let content = "";
        
        if (update.message.caption) {
          const parts = update.message.caption.split("\n\n");
          title = parts[0].replace(/^<b>(.*)<\/b>$/i, '$1'); // Supprimer les balises HTML
          content = parts.length > 1 ? parts.slice(1).join("\n\n") : "";
        }
        
        articles.push({
          id: update.message.message_id,
          title: title,
          content: content,
          excerpt: content.substring(0, 150) + "...",
          featuredImage: photoUrl,
          date: new Date(update.message.date * 1000).toISOString(),
        });
      }
    }
  }
  
  // Trier les articles par date (plus récent d'abord)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
