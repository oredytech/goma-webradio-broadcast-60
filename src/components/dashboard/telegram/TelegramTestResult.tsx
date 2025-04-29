
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface TelegramTestResultProps {
  result: {
    success: boolean;
    message: string;
  };
}

export const TelegramTestResult = ({ result }: TelegramTestResultProps) => {
  return (
    <Alert variant={result.success ? "default" : "destructive"}>
      {result.success ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {result.success ? "Test réussi" : "Échec du test"}
      </AlertTitle>
      <AlertDescription>{result.message}</AlertDescription>
    </Alert>
  );
};
