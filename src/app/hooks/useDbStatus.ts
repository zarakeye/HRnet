import { useState, useEffect } from 'react';

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_DEVELOPMENT_HEALTHCHECK
    : import.meta.env.VITE_API_URL_PRODUCTION_HEALTHCHECK;

  /**
   * Renvoie un objet avec une propriété `isDbWaking` pour indiquer si la base de données est en train de se réveiller.
   *
   * Lorsque la base de données est inactive plus de 5 minutes, la fonction lance une requête pour vérifier si la base de données
   * est prête. Si la réponse prend plus de 500ms, la base de données est considérée comme en train de se réveiller.
   *
   * @returns {Object}
   * @property {boolean} isDbWaking - True si la base de données est en train de se réveiller
   */
export function useDbStatus() {
  const [isDbWaking, setIsDbWaking] = useState<boolean>(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);

  useEffect(() => {
    /**
     * Checks the status of the database by sending a GET request to the health endpoint.
     * If the response time exceeds 500ms, it is assumed that the database is waking up.
     * Continues to poll the database status every second until it is ready.
     * 
     * Sets `isDbWaking` to true if the database is waking up or an error occurs.
     * Sets `isDbWaking` to false and updates `lastActive` when the database is confirmed ready.
     */
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

    // Vérifier seulement si la dernière activité était il y a plus de 4 mins
    if (!lastActive || Date.now() - lastActive.getTime() > 4 * 60 * 1000) {
      checkDbStatus();
    }
  }, [lastActive]);

  return { isDbWaking };
}