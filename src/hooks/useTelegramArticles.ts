
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getUpdates, 
  parseUpdatesToArticles, 
  TelegramArticle 
} from "@/services/telegram";

export const useTelegramArticles = () => {
  return useQuery<TelegramArticle[]>({
    queryKey: ["telegram-articles"],
    queryFn: async () => {
      const updates = await getUpdates();
      return parseUpdatesToArticles(updates);
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
