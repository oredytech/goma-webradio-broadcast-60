
import { useState, useEffect } from 'react';

// Configuration de l'API Google Analytics
const API_KEY = 'AIzaSyCI0JB7G2INWc9hGJMb7_UJcb2k1bGdpSM';
const MEASUREMENT_ID = 'G-ZJFRKKGTTS';
const BASE_URL = 'https://analyticsdata.googleapis.com/v1beta';

export interface AnalyticsData {
  pageViews: number;
  visitors: number;
  mostViewedPages: {
    path: string;
    views: number;
    title: string;
  }[];
  articleViews: {
    articleId: string;
    title: string;
    views: number;
  }[];
}

// Hook personnalisé pour récupérer les données analytiques
export const useAnalyticsData = (
  startDate: string = getLastMonthDate(),
  endDate: string = getCurrentDate()
) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Dans une application réelle, cette requête devrait être faite via un backend
        // car l'API key ne devrait pas être exposée côté client
        // Exemple de données simulées pour la démo
        const mockData: AnalyticsData = {
          pageViews: 12458,
          visitors: 3842,
          mostViewedPages: [
            { path: '/', views: 4562, title: 'Accueil' },
            { path: '/actualites', views: 2134, title: 'Actualités' },
            { path: '/podcasts', views: 1896, title: 'Podcasts' },
            { path: '/a-propos', views: 986, title: 'À propos' },
            { path: '/article/15/nouvelles-emissions', views: 745, title: 'Nouvelles émissions' }
          ],
          articleViews: [
            { articleId: '15', title: 'Nouvelles émissions', views: 745 },
            { articleId: '23', title: 'Interview exclusive', views: 612 },
            { articleId: '18', title: 'Rencontre avec les artistes', views: 589 },
            { articleId: '29', title: 'Actualités politiques', views: 478 },
            { articleId: '32', title: 'Évènements communautaires', views: 423 }
          ]
        };
        
        // Pour une implémentation réelle, nous aurions besoin d'une authentification OAuth2
        // et d'appeler l'API via un backend sécurisé
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        console.error('Erreur lors de la récupération des données Analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [startDate, endDate]);

  return { data, isLoading, error };
};

// Fonction utilitaire pour obtenir la date actuelle au format YYYY-MM-DD
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Fonction utilitaire pour obtenir la date d'il y a un mois au format YYYY-MM-DD
function getLastMonthDate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0];
}

