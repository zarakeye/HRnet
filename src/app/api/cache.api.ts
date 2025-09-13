import CryptoJS from 'crypto-js';

// src/api/cache.api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Configuration du chiffrement
const ENCRYPTION_CONFIG = {
  keySize: 256 / 32,
  iterations: 100000
};

// Fonction pour dériver une clé à partir du mot de passe
const deriveKeyFromPassword = (password: string, salt: string): CryptoJS.lib.WordArray => {
  return CryptoJS.PBKDF2(password, salt, ENCRYPTION_CONFIG);
};

export interface CachedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export const getCachedData = async (key: string, token: string, password: string): Promise<any> => {
  try {
    console.log(`Requesting cached data for key: ${key}`);
    console.log(`Using token: ${token}`);

    const response = await fetch(`${API_BASE_URL}/api/cache/${key}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers: ${JSON.stringify(response.headers)}`);
    console.log(`Response body: ${await response.text()}`);
    console.log(`Cache API response status: ${response.status} for key: ${key}`);

    if (response.status === 404) {
      // Données non trouvées dans le cache, ce n'est pas une erreur
      return null;
    }

    if (response.status === 403) {
      // Token invalide ou expiré
      console.log('Forbidden access: Token might be invalid or expired');
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cache API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to retrieve cached data: ${response.statusText}`);
    }

    const data: CachedData = await response.json();
    console.log('Cached data retrieved successfully:', data);
    
    // Déchiffrer les données
    try {
      const salt = CryptoJS.enc.Hex.parse(data.iv);
      const key = deriveKeyFromPassword(password, salt.toString());
      
      const bytes = CryptoJS.AES.decrypt(data.encrypted, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      console.log('Decrypted data:', decryptedData);
      return JSON.parse(decryptedData);
    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      throw new Error('Failed to decrypt cached data');
    }
  } catch (error) {
    console.error('Error getting cached data:', error);
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw error; // Propager l'erreur d'authentification
    }
    console.error('Error getting cached data:', error);
    throw new Error('Failed to retrieve cached data');
  }
};

export const setCachedData = async (key: string, data: any, ttl: number, token: string, password: string): Promise<void> => {
  try {
    // Chiffrer les données avant envoi
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const derivedKey = deriveKeyFromPassword(password, salt.toString());
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey).toString();

    const response = await fetch(`${API_BASE_URL}/api/cache/${key}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: {
          encrypted,
          iv: salt.toString(CryptoJS.enc.Hex),
          authTag: '' // Pour compatibilité avec le backend existant
        }, 
        ttl 
      }),
    });

    if (response.status === 403) {
      // Token invalide ou expiré
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cache API error: ${response.status} - ${errorText}`);
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