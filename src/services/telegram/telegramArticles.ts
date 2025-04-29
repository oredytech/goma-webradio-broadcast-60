
import { sendTextMessage, sendImage, uploadImage } from './telegramMessaging';
import { getDefaultChatId } from './telegramConfig';

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
