import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formsubmit.co/contact@gomawebradio.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Nous contacter</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nom</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
          <div className="bg-secondary/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Nos coordonnées</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-primary">📍</span>
                <p>RDCongo, Province du Nord-Kivu<br />
                   Ville de Goma/Commune de KARISIMBI</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">📞</span>
                <div>
                  <p className="font-medium">Rédaction :</p>
                  <p>+243 851 006 476</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">📞</span>
                <div>
                  <p className="font-medium">Direction :</p>
                  <p>+243 996 886 079</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">✉️</span>
                <a href="mailto:contact@gomawebradio.com" className="hover:text-primary transition-colors">
                  contact@gomawebradio.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
