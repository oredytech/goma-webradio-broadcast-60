import TelegramSettings from "./TelegramSettings";

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
      
      <TelegramSettings />
      
      {/* Autres sections de paramètres peuvent être ajoutées ici */}
    </div>
  );
};

export default SettingsPanel;
