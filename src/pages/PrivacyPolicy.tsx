import React, { useState } from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const AccordionSection: React.FC<SectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-600 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center text-lg font-semibold text-white"
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="mt-2 text-gray-300">{children}</div>}
    </div>
  );
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg mt-10 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">🔒 Politique de Confidentialité</h1>
      <p className="text-gray-400 mb-4 text-sm text-center">
        Dernière mise à jour : 10 avril 2025
      </p>

      <AccordionSection title="1. Qui sommes-nous ?">
        <p>
          GOMA WEBRADIO est une plateforme de diffusion de radios en ligne, basée à Goma, RDC. 
          Notre mission est de faire rayonner les sons du Congo et d’ailleurs, tout en respectant 
          la vie privée de nos auditeurs.
        </p>
      </AccordionSection>

      <AccordionSection title="2. Quelles données collectons-nous ?">
        <ul className="list-disc pl-6">
          <li>Données techniques : IP, navigateur, OS, pages vues...</li>
          <li>Cookies et traceurs (voir plus bas)</li>
          <li>Données fournies via les formulaires (contact, newsletter, etc.)</li>
        </ul>
      </AccordionSection>

      <AccordionSection title="3. Utilisation de vos données">
        <ul className="list-disc pl-6">
          <li>Amélioration de nos services</li>
          <li>Personnalisation de l’expérience utilisateur</li>
          <li>Publicité ciblée et mesure d’audience</li>
          <li>Réponse à vos messages</li>
        </ul>
        <p className="mt-2">Nous ne vendons jamais vos données. Jamais.</p>
      </AccordionSection>

      <AccordionSection title="4. Cookies 🍪">
        <p>
          Nous utilisons des cookies pour faire fonctionner le site, mémoriser vos préférences, 
          analyser notre audience et afficher des publicités adaptées.
        </p>
        <p className="mt-2">
          Vous pouvez à tout moment modifier vos choix via notre bannière ou les paramètres de confidentialité en bas de page.
        </p>
      </AccordionSection>

      <AccordionSection title="5. Partage de vos données">
        <p>
          Certaines données peuvent être partagées avec des partenaires analytiques ou publicitaires 
          dans le cadre du RGPD. Vous pouvez refuser ces traitements basés sur l’intérêt légitime.
        </p>
      </AccordionSection>

      <AccordionSection title="6. Durée de conservation">
        <p>
          Cookies : max 13 mois.  
          Formulaires et échanges : jusqu’à 3 ans.  
          Nous ne gardons rien de plus que nécessaire.
        </p>
      </AccordionSection>

      <AccordionSection title="7. Vos droits">
        <ul className="list-disc pl-6">
          <li>Accès à vos données</li>
          <li>Rectification ou suppression</li>
          <li>Opposition et retrait de consentement</li>
          <li>Plainte auprès de l’autorité de contrôle</li>
        </ul>
        <p className="mt-2">Contact : <strong>privacy@gomawebradio.com</strong></p>
      </AccordionSection>

      <AccordionSection title="8. Sécurité">
        <p>
          Connexion HTTPS, protections serveur, accès limité…  
          On fait tout pour vous protéger, mais le risque zéro n’existe pas.
        </p>
      </AccordionSection>

      <AccordionSection title="9. Modifications">
        <p>
          Cette politique peut évoluer. Les changements majeurs seront signalés par une bannière ou une notification sur le site.
        </p>
      </AccordionSection>

      <AccordionSection title="10. Contact">
        <p>
          Pour toute question ou demande liée à vos données :  
          📧 <strong>privacy@gomawebradio.com</strong>  
          🌍 <strong>www.gomawebradio.com</strong>
        </p>
      </AccordionSection>
    </div>
  );
};

export default PrivacyPolicy;
