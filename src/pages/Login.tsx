import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Login = () => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);

  const onSubmitLogin = async (values: any) => {
    try {
      console.log(values);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
      });
    }
  };

  const onSubmitRegister = async (values: any) => {
    try {
      console.log(values);
      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter.",
      });
      setIsLogin(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la création du compte",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#E5DEFF]">
      <Header />
      <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="w-full max-w-md space-y-6 bg-secondary/50 p-6 sm:p-8 rounded-lg border border-primary/20 backdrop-blur-sm animate-fade-in">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? "Entrez vos identifiants pour accéder à votre compte"
                : "Remplissez le formulaire pour créer votre compte"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm onSubmit={onSubmitLogin} />
          ) : (
            <RegisterForm onSubmit={onSubmitRegister} />
          )}

          <div className="text-center space-y-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
            </button>
            {isLogin && (
              <div>
                <a
                  href="#"
                  className="text-primary hover:underline text-sm block"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;