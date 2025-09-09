import localforage from "localforage";
import { Employee } from "../common/types";
import CryptoJS from "crypto-js";

const CACHE_KEY = "employees_cache";
const CACHE_TIMESTAMP_KEY = "employees_cache_timestamp";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to derive a key from a password
export const deriveKeyFromPassword = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256
  });
}

export const getCachedEmployees = async (): Promise<Employee[]> => {
  const timestamp = await localforage.getItem<number>(CACHE_TIMESTAMP_KEY);

  // Verify if the cache is still valid
  if (timestamp && Date.now() - timestamp < CACHE_TTL) {
    const cachedEmployees = await localforage.getItem<Employee[]>(CACHE_KEY);
    return cachedEmployees || [];
  }

  return [];
}

export const saveEmployeesToCache = async (employees: Employee[]) => {
  await localforage.setItem(CACHE_KEY, employees);
  await localforage.setItem(CACHE_TIMESTAMP_KEY, Date.now());
}

export const clearCache = async () => {
  await localforage.removeItem(CACHE_KEY);
  await localforage.removeItem(CACHE_TIMESTAMP_KEY);
}

export const currentTimestamp = async (): Promise<number | null> => {
  const timestamp = await localforage.getItem<number>(CACHE_TIMESTAMP_KEY);
  return timestamp || null;
}