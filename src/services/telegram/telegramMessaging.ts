
import { getTelegramApiBaseUrl, getDefaultChatId } from './telegramConfig';

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
