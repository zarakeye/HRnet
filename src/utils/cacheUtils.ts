import localforage from "localforage";
import { Employee } from "../common/types";

const CACHE_KEY = "employees_cache";
const CACHE_TIMESTAMP_KEY = "employees_cache_timestamp";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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