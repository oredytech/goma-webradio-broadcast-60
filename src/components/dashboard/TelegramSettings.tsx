
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { InfoIcon, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { getDefaultChatId, setDefaultChatId, sendTextMessage } from "@/services/telegramService";

const TelegramSettings = () => {
  const [chatId, setChatId] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  // Charger le chat ID actuel au chargement du composant
  useEffect(() => {
    setChatId(getDefaultChatId());
  }, []);

  const handleSaveChatId = () => {
    if (!chatId || chatId.trim() === "") {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un Chat ID valide",
        variant: "destructive",
      });
      return;
    }

    setDefaultChatId(chatId.trim());
    toast({
      title: "Chat ID sauvegardé",
      description: "Le Chat ID par défaut a été mis à jour",
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await sendTextMessage("Test de connexion au bot Telegram depuis l'application", chatId);
      
      if (success) {
        setTestResult({
          success: true,
          message: "Message test envoyé avec succès. Vérifiez votre chat Telegram."
        });
      } else {
        setTestResult({
          success: false,
          message: "Échec de l'envoi du message test. Vérifiez le Chat ID et assurez-vous que vous avez démarré une conversation avec le bot."
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configuration Telegram</CardTitle>
        <CardDescription>
          Configurez les paramètres de connexion à Telegram pour la publication d'articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Comment trouver votre Chat ID</AlertTitle>
            <AlertDescription>
              1. Recherchez "@userinfobot" sur Telegram et démarrez une conversation <br />
              2. Le bot vous répondra avec votre Chat ID personnel <br />
              3. Assurez-vous également de démarrer une conversation avec le bot utilisé par cette application
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="chat-id" className="text-sm font-medium">
              Chat ID Telegram
            </label>
            <Input
              id="chat-id"
              placeholder="Entrez votre Chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Il s'agit de l'identifiant du chat où les articles seront publiés
            </p>
          </div>
        </div>
        
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {testResult.success ? "Test réussi" : "Échec du test"}
            </AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTesting || !chatId}
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
        <Button onClick={handleSaveChatId} disabled={isTesting || !chatId}>
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TelegramSettings;
