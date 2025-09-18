import CryptoJS from 'crypto-js';
// import { Employee } from '../../common/types';

// src/api/cache.api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let cacheAvailable = true;

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

export const checkCacheAvailability = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    cacheAvailable = response.ok;
    return cacheAvailable;
  } catch (error) {
    console.error('Error checking cache availability:', error);
    cacheAvailable = false;
    return false;
  }
};

export const getCachedData = async (key: string, token: string, password: string): Promise< any> => {
  if (!cacheAvailable) {
    console.log('Cache API is not available: skipping cache retrieval');
    return null;
  }
  
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

    if (response.status === 404) {
      console.log('No cached data found (404)');
      return null;
    }

    if (response.status === 403) {
      // Token invalide ou expiré
      console.log('Forbidden access: Token might be invalid or expired');
      throw new Error('FORBIDDEN');
    }

    if (!response.ok) {
      cacheAvailable = false;
      return null;
    }

    const data: CachedData = await response.json();
    console.log('Cached data retrieved successfully:', data);
    
    // Déchiffrer les données
    try {
      const salt = CryptoJS.enc.Hex.parse(data.iv);
      const derivedKey = deriveKeyFromPassword(password, salt.toString());
      const decrypted = CryptoJS.AES.decrypt(data.encrypted, derivedKey, {
        iv: salt,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Decrypted data after toString:', decryptedData);
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

    cacheAvailable = false;
    return null;
  }
};

export const setCachedData = async (key: string, data: any, ttl: number, token: string, password: string): Promise<void> => {
  if (!cacheAvailable) {
    console.log('Cache API is not available: skipping cache storage');
    return;
  }
  
  try {
    console.log(`Setting cached data for key: ${key}`);
    console.log('Data to cache:', data);
    console.log('Password available:', !!password);

    if (!password) {
      throw new Error('Encryption password is required');
    }

    // Chiffrer les données avant envoi
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const derivedKey = deriveKeyFromPassword(password, salt.toString());
    // const derivedKey = CryptoJS.PBKDF2(password, salt, ENCRYPTION_CONFIG);
    // const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey).toString();
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey, {
      iv: salt,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

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
      // const errorText = await response.text();
      // console.error(`Cache API error: ${response.status} - ${errorText}`);
      // throw new Error(`Failed to store cached data: ${response.statusText}`);
      cacheAvailable = false;
    }
  } catch (error) {
    // if (error instanceof Error && error.message === 'FORBIDDEN') {
    //   throw error; // Propager l'erreur d'authentification
    // }
    // console.error('Error setting cached data:', error);
    // throw new Error('Failed to store cached data');
    cacheAvailable = false;
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