
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const TelegramInstructions = () => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Comment configurer votre bot Telegram</AlertTitle>
      <AlertDescription>
        1. Créez un bot Telegram via @BotFather et obtenez le token<br />
        2. Démarrez une conversation avec votre bot<br />
        3. Trouvez votre Chat ID en cherchant "@userinfobot" sur Telegram et en démarrant une conversation
      </AlertDescription>
    </Alert>
  );
};
