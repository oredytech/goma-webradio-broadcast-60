
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

// Fonction utilitaire pour obtenir l'URL de base de l'API Telegram avec le token actuel
export const getTelegramApiBaseUrl = (): string => {
  const token = getTelegramBotToken();
  return `https://api.telegram.org/bot${token}`;
};
