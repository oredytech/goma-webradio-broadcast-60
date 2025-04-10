
const TELEGRAM_BOT_TOKEN = "7296852683:AAGg_NXW_JCh-B_P3miM-8zYqtyG8Nb1ZUE";
const API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

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

// Envoyer un message texte au bot
export const sendTextMessage = async (text: string, chatId: string = "5591733599"): Promise<boolean> => {
  try {
    console.log("Envoi de message texte à Telegram:", { chatId, textLength: text.length });
    
    const response = await fetch(`${API_BASE_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    console.log("Réponse de l'API Telegram (message):", data);
    
    if (!data.ok) {
      console.error("Erreur API Telegram:", data.description);
    }
    
    return data.ok;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message à Telegram:", error);
    return false;
  }
};

// Envoyer une image au bot
export const sendImage = async (
  imageUrl: string,
  caption: string = "",
  chatId: string = "5591733599"
): Promise<boolean> => {
  try {
    console.log("Envoi d'image à Telegram:", { chatId, imageUrl, captionLength: caption.length });
    
    // Vérification de l'URL de l'image
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.error("URL d'image invalide:", imageUrl);
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/sendPhoto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: imageUrl,
        caption: caption,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    console.log("Réponse de l'API Telegram (image):", data);
    
    if (!data.ok) {
      console.error("Erreur API Telegram:", data.description);
    }
    
    return data.ok;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'image à Telegram:", error);
    return false;
  }
};

// Récupérer les mises à jour du bot
export const getUpdates = async (offset?: number): Promise<TelegramUpdate[]> => {
  try {
    const params = new URLSearchParams();
    if (offset) {
      params.append("offset", offset.toString());
    }

    const response = await fetch(`${API_BASE_URL}/getUpdates?${params.toString()}`);
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
    const response = await fetch(`${API_BASE_URL}/getFile?file_id=${fileId}`);
    const data = await response.json();

    if (data.ok) {
      return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
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
          const title = parts[0];
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
          title = parts[0];
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
  
  return articles;
};

// Publier un article via Telegram
export const publishArticleViaTelegram = async (
  title: string,
  content: string,
  imageUrl?: string
): Promise<boolean> => {
  try {
    console.log("Tentative de publication d'article sur Telegram:", { title, contentLength: content.length, imageUrl });
    
    // Vérifier que nous avons au moins un titre
    if (!title || title.trim() === "") {
      console.error("Erreur de publication: Titre manquant");
      return false;
    }
    
    let success = false;
    
    if (imageUrl && imageUrl.trim() !== "") {
      // Si on a une image, on l'envoie avec la légende contenant titre + contenu
      console.log("Publication avec image");
      success = await sendImage(imageUrl, `<b>${title}</b>\n\n${content}`);
    } else {
      // Sinon on envoie juste le texte
      console.log("Publication texte uniquement");
      success = await sendTextMessage(`<b>${title}</b>\n\n${content}`);
    }
    
    console.log("Résultat de la publication:", success ? "Réussi" : "Échec");
    return success;
  } catch (error) {
    console.error("Erreur lors de la publication d'article via Telegram:", error);
    return false;
  }
};
