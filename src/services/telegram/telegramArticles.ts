
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
      uploadedImageName: uploadedImage?.name,
      uploadedImageSize: uploadedImage ? `${(uploadedImage.size / 1024).toFixed(2)} KB` : null,
      chatId: targetChatId
    });
    
    // Vérifier que nous avons au moins un titre
    if (!title || title.trim() === "") {
      console.error("Erreur de publication: Titre manquant");
      return false;
    }
    
    // Préparer le contenu formaté
    const formattedContent = `<b>${title}</b>\n\n${content}`;
    let success = false;
    
    if (uploadedImage instanceof File && uploadedImage.size > 0) {
      // Si on a une image téléversée valide, priorité à cette image
      console.log("Publication avec image téléversée:", uploadedImage.name);
      success = await uploadImage(uploadedImage, formattedContent, targetChatId);
      
      // Si l'envoi avec image téléversée échoue mais qu'il y a une URL d'image, essayer avec l'URL
      if (!success && imageUrl && imageUrl.trim() !== "") {
        console.log("Échec avec l'image téléversée, tentative avec l'URL d'image:", imageUrl);
        success = await sendImage(imageUrl, formattedContent, targetChatId);
      }
    } else if (imageUrl && imageUrl.trim() !== "") {
      // Sinon, si on a une URL d'image valide, on l'envoie
      console.log("Publication avec image URL:", imageUrl);
      success = await sendImage(imageUrl, formattedContent, targetChatId);
    }
    
    // Si l'envoi avec image a échoué ou s'il n'y a pas d'image, envoyer juste le texte
    if (!success) {
      console.log("Publication texte uniquement (après échec avec image ou pas d'image)");
      success = await sendTextMessage(formattedContent, targetChatId);
    }
    
    console.log("Résultat de la publication:", success ? "Réussi" : "Échec");
    return success;
  } catch (error) {
    console.error("Erreur lors de la publication d'article via Telegram:", error);
    return false;
  }
};
