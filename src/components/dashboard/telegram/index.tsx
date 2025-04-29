
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { TelegramInstructions } from "./TelegramInstructions";
import { TelegramConfigForm } from "./TelegramConfigForm";
import { sendTextMessage } from "@/services/telegramService";

const TelegramSettings = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configuration Telegram</CardTitle>
        <CardDescription>
          Configurez les paramètres de connexion à Telegram pour la publication d'articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TelegramInstructions />
        <TelegramConfigForm />
      </CardContent>
    </Card>
  );
};

export default TelegramSettings;
