
// Stockage local du token et du chat ID
let TELEGRAM_BOT_TOKEN = "7296852683:AAGg_NXW_JCh-B_P3miM-8zYqtyG8Nb1ZUE";
let DEFAULT_CHAT_ID = "5591733599"; // Valeur par défaut

// Fonction pour définir le token du bot
export const setTelegramBotToken = (token: string): void => {
  if (!token || token.trim() === "") {
    console.error("Token invalide, impossible de définir comme valeur par défaut");
    return;
  }
  console.log("Définition du token du bot:", token);
  TELEGRAM_BOT_TOKEN = token.trim();
  
  // Stocker dans localStorage pour persistance
  try {
    localStorage.setItem("telegram_bot_token", TELEGRAM_BOT_TOKEN);
  } catch (e) {
    console.warn("Impossible de sauvegarder le token dans localStorage:", e);
  }
};

// Fonction pour récupérer le token du bot
export const getTelegramBotToken = (): string => {
  // Essayer de récupérer depuis localStorage
  try {
    const storedToken = localStorage.getItem("telegram_bot_token");
    if (storedToken) {
      TELEGRAM_BOT_TOKEN = storedToken;
    }
  } catch (e) {
    console.warn("Impossible de récupérer le token depuis localStorage:", e);
  }
  
  return TELEGRAM_BOT_TOKEN;
};

// Fonction pour définir le chat ID par défaut
export const setDefaultChatId = (chatId: string): void => {
  if (!chatId || chatId.trim() === "") {
    console.error("Chat ID invalide, impossible de définir comme valeur par défaut");
    return;
  }
  console.log("Définition du chat ID par défaut:", chatId);
  DEFAULT_CHAT_ID = chatId.trim();
  
  // Stocker dans localStorage pour persistance
  try {
    localStorage.setItem("telegram_default_chat_id", DEFAULT_CHAT_ID);
  } catch (e) {
    console.warn("Impossible de sauvegarder le chat ID dans localStorage:", e);
  }
};

// Fonction pour récupérer le chat ID par défaut
export const getDefaultChatId = (): string => {
  // Essayer de récupérer depuis localStorage
  try {
    const storedChatId = localStorage.getItem("telegram_default_chat_id");
    if (storedChatId) {
      DEFAULT_CHAT_ID = storedChatId;
    }
  } catch (e) {
    console.warn("Impossible de récupérer le chat ID depuis localStorage:", e);
  }
  
  return DEFAULT_CHAT_ID;
};

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

// Fonction utilitaire pour obtenir l'URL de base de l'API Telegram avec le token actuel
const getTelegramApiBaseUrl = (): string => {
  const token = getTelegramBotToken();
  return `https://api.telegram.org/bot${token}`;
};

// Envoyer un message texte au bot
export const sendTextMessage = async (text: string, chatId?: string): Promise<boolean> => {
  try {
    // Utiliser le chat ID fourni ou la valeur par défaut
    const targetChatId = chatId || getDefaultChatId();
    const apiBaseUrl = getTelegramApiBaseUrl();
    
    console.log("Envoi de message texte à Telegram:", { 
      chatId: targetChatId, 
      textLength: text.length,
      apiBaseUrl
    });
    
    const response = await fetch(`${apiBaseUrl}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: targetChatId,
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
  chatId?: string
): Promise<boolean> => {
  try {
    // Utiliser le chat ID fourni ou la valeur par défaut
    const targetChatId = chatId || getDefaultChatId();
    const apiBaseUrl = getTelegramApiBaseUrl();
    
    console.log("Envoi d'image à Telegram:", { 
      chatId: targetChatId, 
      imageUrl, 
      captionLength: caption.length,
      apiBaseUrl
    });
    
    // Vérification de l'URL de l'image
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.error("URL d'image invalide:", imageUrl);
      return false;
    }
    
    const response = await fetch(`${apiBaseUrl}/sendPhoto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: targetChatId,
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

// Téléversement d'une image locale à Telegram
export const uploadImage = async (
  imageFile: File,
  caption: string = "",
  chatId?: string
): Promise<boolean> => {
  try {
    // Utiliser le chat ID fourni ou la valeur par défaut
    const targetChatId = chatId || getDefaultChatId();
    const apiBaseUrl = getTelegramApiBaseUrl();
    
    console.log("Téléversement d'image à Telegram:", { 
      chatId: targetChatId, 
      imageFileName: imageFile.name,
      imageFileSize: `${(imageFile.size / 1024).toFixed(2)}KB`, 
      captionLength: caption.length,
    });
    
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("chat_id", targetChatId);
    formData.append("photo", imageFile);
    
    if (caption) {
      formData.append("caption", caption);
      formData.append("parse_mode", "HTML");
    }
    
    const response = await fetch(`${apiBaseUrl}/sendPhoto`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Réponse de l'API Telegram (téléversement d'image):", data);
    
    if (!data.ok) {
      console.error("Erreur API Telegram:", data.description);
    }
    
    return data.ok;
  } catch (error) {
    console.error("Erreur lors du téléversement de l'image à Telegram:", error);
    return false;
  }
};

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
  imageUrl?: string,
  uploadedImage?: File,
  chatId?: string
): Promise<boolean> => {
  try {
    // Utiliser le chat ID fourni ou la valeur par défaut
    const targetChatId = chatId || getDefaultChatId();
    
    console.log("Tentative de publication d'article sur Telegram:", { 
      title, 
      contentLength: content.length, 
      imageUrl,
      hasUploadedImage: !!uploadedImage,
      chatId: targetChatId
    });
    
    // Vérifier que nous avons au moins un titre
    if (!title || title.trim() === "") {
      console.error("Erreur de publication: Titre manquant");
      return false;
    }
    
    let success = false;
    const formattedContent = `<b>${title}</b>\n\n${content}`;
    
    if (uploadedImage) {
      // Si on a une image téléversée, priorité à cette image
      console.log("Publication avec image téléversée");
      success = await uploadImage(uploadedImage, formattedContent, targetChatId);
    } else if (imageUrl && imageUrl.trim() !== "") {
      // Sinon, si on a une URL d'image, on l'envoie
      console.log("Publication avec image URL");
      success = await sendImage(imageUrl, formattedContent, targetChatId);
    } else {
      // Sinon on envoie juste le texte
      console.log("Publication texte uniquement");
      success = await sendTextMessage(formattedContent, targetChatId);
    }
    
    console.log("Résultat de la publication:", success ? "Réussi" : "Échec");
    return success;
  } catch (error) {
    console.error("Erreur lors de la publication d'article via Telegram:", error);
    return false;
  }
};
