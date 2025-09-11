// src/api/cache.api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface CachedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export const getCachedData = async (key: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/${key}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 403) {
      // Token invalide ou expiré
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      if (response.status === 404) {
        // Données non trouvées dans le cache, ce n'est pas une erreur
        return null;
      }
      throw new Error(`Failed to retrieve cached data: ${response.statusText}`);
    }

    const data: CachedData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw error; // Propager l'erreur d'authentification
    }
    console.error('Error getting cached data:', error);
    throw new Error('Failed to retrieve cached data');
  }
};

export const setCachedData = async (key: string, data: any, ttl: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/${key}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, ttl }),
    });

    if (response.status === 403) {
      // Token invalide ou expiré
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      throw new Error(`Failed to store cached data: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw error; // Propager l'erreur d'authentification
    }
    console.error('Error setting cached data:', error);
    throw new Error('Failed to store cached data');
  }
};

export const deleteCachedData = async (key: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/${key}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      // Token invalide ou expiré
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      throw new Error(`Failed to delete cached data: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw error; // Propager l'erreur d'authentification
    }
    console.error('Error deleting cached data:', error);
    throw new Error('Failed to delete cached data');
  }
};

export const clearAllCache = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      // Token invalide ou expiré
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      throw new Error(`Failed to clear cache: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw error; // Propager l'erreur d'authentification
    }
    console.error('Error clearing cache:', error);
    throw new Error('Failed to clear cache');
  }
};