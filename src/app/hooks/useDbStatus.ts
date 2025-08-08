import { useState, useEffect } from 'react';

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_DEVELOPMENT_HEALTHCHECK
    : import.meta.env.VITE_API_URL_PRODUCTION_HEALTHCHECK;

export function useDbStatus() {
  const [isDbWaking, setIsDbWaking] = useState<boolean>(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const start = Date.now();
        setIsDbWaking(true);

        // Utilisez un endpoint dédié plutôt qu'une requête métier
        const response = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error('DB not ready');

        // Si la réponse prend plus de 500ms, considérez que la DB était en sommeil
        if (Date.now() - start > 500) {
          setIsDbWaking(true);
          // Vérification supplémentaire pour confirmer
          setTimeout(checkDbStatus, 1000);
        } else {
          setIsDbWaking(false);
          setLastActive(new Date());
        }
      } catch (error) {
        setIsDbWaking(true);
        // Vérification supplémentaire pour confirmer
        setTimeout(checkDbStatus, 2000);
      }
    };

    // Vérifier seulement si la dernière activité était il y a plus de 5 mins
    if (!lastActive || Date.now() - lastActive.getTime() > 5 * 60 * 1000) {
      checkDbStatus();
    }
  }, [lastActive]);

  return { isDbWaking };
}