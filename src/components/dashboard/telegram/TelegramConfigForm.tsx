
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Key, Lock } from "lucide-react";
import { 
  getDefaultChatId, 
  setDefaultChatId, 
  getTelegramBotToken,
  setTelegramBotToken,
  sendTextMessage
} from "@/services/telegramService";
import { TelegramTestResult } from "./TelegramTestResult";
import { useToast } from "@/components/ui/use-toast";

const telegramFormSchema = z.object({
  botToken: z.string().min(1, "Le token du bot est requis"),
  chatId: z.string().min(1, "L'ID de chat est requis"),
});

export type TelegramFormValues = z.infer<typeof telegramFormSchema>;

export const TelegramConfigForm = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<TelegramFormValues>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues: {
      botToken: "",
      chatId: "",
    },
  });

  // Charger les valeurs actuelles au chargement du composant
  useEffect(() => {
    form.setValue("botToken", getTelegramBotToken());
    form.setValue("chatId", getDefaultChatId());
  }, [form]);

  const onSubmit = (values: TelegramFormValues) => {
    setTelegramBotToken(values.botToken);
    setDefaultChatId(values.chatId);
    
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres Telegram ont été mis à jour",
    });
  };

  const handleTestConnection = async () => {
    const values = form.getValues();
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Sauvegarde temporaire des valeurs pour le test
      setTelegramBotToken(values.botToken);
      setDefaultChatId(values.chatId);
      
      const success = await sendTextMessage("Test de connexion au bot Telegram depuis l'application", values.chatId);
      
      if (success) {
        setTestResult({
          success: true,
          message: "Message test envoyé avec succès. Vérifiez votre chat Telegram."
        });
      } else {
        setTestResult({
          success: false,
          message: "Échec de l'envoi du message test. Vérifiez le Token du bot et le Chat ID."
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erreur lors du test: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="botToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token du Bot Telegram</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Exemple: 123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ" 
                    {...field} 
                    type="password"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Le token unique fourni par BotFather lors de la création de votre bot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="chatId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat ID Telegram</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Exemple: 123456789" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                L'identifiant du chat où les articles seront publiés
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {testResult && <TelegramTestResult result={testResult} />}
        
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting || !form.getValues().botToken || !form.getValues().chatId}
          >
            {isTesting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Test en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Tester la connexion
              </>
            )}
          </Button>
          <Button type="submit">Sauvegarder</Button>
        </div>
      </form>
    </Form>
  );
};
