
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Paramètres du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <input 
              id="name" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value="Administrateur"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <input 
              id="email" 
              type="email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value="admin@gomawebradio.com"
            />
          </div>
          <Button>Mettre à jour</Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Activer les notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="email-alerts" />
            <Label htmlFor="email-alerts">Alertes par email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="analytics" defaultChecked />
            <Label htmlFor="analytics">Collecter les statistiques</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Google Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">Clé API</Label>
            <input 
              id="api-key" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value="AIzaSyCI0JB7G2INWc9hGJMb7_UJcb2k1bGdpSM"
              type="password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="measurement-id">ID de mesure</Label>
            <input 
              id="measurement-id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value="G-ZJFRKKGTTS"
            />
          </div>
          <div className="pt-2">
            <Button variant="outline">Tester la connexion</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="text-destructive">
          <CardTitle>Zone dangereuse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Ces actions sont irréversibles. Veuillez procéder avec prudence.
          </p>
          <div className="space-y-4">
            <Button variant="destructive">Supprimer les données analytiques</Button>
            <Separator />
            <Button variant="destructive">Réinitialiser mon mot de passe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
