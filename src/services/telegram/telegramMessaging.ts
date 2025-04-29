
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

// Limitation de Telegram pour la taille des légendes (captions)
const MAX_CAPTION_LENGTH = 1024; // Telegram limite à 1024 caractères pour les légendes d'images

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
    
    // Vérification de l'URL de l'image
    if (!imageUrl || !imageUrl.trim() || !(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      console.error("URL d'image invalide:", imageUrl);
      return false;
    }
    
    // Tronquer la légende si elle est trop longue
    const truncatedCaption = caption.length > MAX_CAPTION_LENGTH 
      ? caption.substring(0, MAX_CAPTION_LENGTH) + "..."
      : caption;
    
    console.log("Envoi d'image à Telegram:", { 
      chatId: targetChatId, 
      imageUrl, 
      captionLength: caption.length,
      truncatedCaptionLength: truncatedCaption.length,
      apiBaseUrl
    });
    
    const response = await fetch(`${apiBaseUrl}/sendPhoto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        photo: imageUrl,
        caption: truncatedCaption,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    console.log("Réponse de l'API Telegram (image):", data);
    
    // Si la légende était trop longue et a été tronquée, envoyer le reste en tant que message texte
    if (caption.length > MAX_CAPTION_LENGTH && data.ok) {
      console.log("Légende tronquée, envoi du texte complet en message séparé");
      await sendTextMessage(caption, targetChatId);
    }
    
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
    // Vérifier que le fichier est valide
    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      console.error("Fichier image invalide:", imageFile);
      return false;
    }
    
    // Vérifier si c'est une image
    if (!imageFile.type.startsWith('image/')) {
      console.error("Le fichier n'est pas une image:", imageFile.type);
      return false;
    }
    
    // Utiliser le chat ID fourni ou la valeur par défaut
    const targetChatId = chatId || getDefaultChatId();
    const apiBaseUrl = getTelegramApiBaseUrl();
    
    // Tronquer la légende si elle est trop longue
    const truncatedCaption = caption.length > MAX_CAPTION_LENGTH 
      ? caption.substring(0, MAX_CAPTION_LENGTH) + "..."
      : caption;
    
    console.log("Téléversement d'image à Telegram:", { 
      chatId: targetChatId, 
      imageFileName: imageFile.name,
      imageFileType: imageFile.type,
      imageFileSize: `${(imageFile.size / 1024).toFixed(2)}KB`, 
      captionLength: caption.length,
      truncatedCaptionLength: truncatedCaption.length,
    });
    
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("chat_id", targetChatId);
    formData.append("photo", imageFile);
    
    if (truncatedCaption) {
      formData.append("caption", truncatedCaption);
      formData.append("parse_mode", "HTML");
    }
    
    const response = await fetch(`${apiBaseUrl}/sendPhoto`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Réponse de l'API Telegram (téléversement d'image):", data);
    
    // Si la légende était trop longue et a été tronquée, envoyer le reste en tant que message texte
    if (caption.length > MAX_CAPTION_LENGTH && data.ok) {
      console.log("Légende tronquée, envoi du texte complet en message séparé");
      await sendTextMessage(caption, targetChatId);
    }
    
    if (!data.ok) {
      console.error("Erreur API Telegram:", data.description);
    }
    
    return data.ok;
  } catch (error) {
    console.error("Erreur lors du téléversement de l'image à Telegram:", error);
    return false;
  }
};
