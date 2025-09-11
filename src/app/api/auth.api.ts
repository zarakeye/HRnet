// src/api/auth.api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const login = async (password: string): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Authentication failed: ${response.statusText} ${response.status}`);
  }

  return response.json();
};

export const verifyToken = async (token: string): Promise<{ valid: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Token verification failed: ${response.statusText} ${response.status}`);
  }

  return response.json();
};