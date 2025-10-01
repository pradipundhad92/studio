import type { Client } from './types';

const API_BASE = "https://39bd58c1b14c.ngrok-free.app/api/v1";

async function fetchApi(url: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const getClients = (tenantId: string): Promise<Client[]> => {
  return fetchApi(`${API_BASE}/clients/${tenantId}`);
};

export const getClientById = (tenantId: string, clientId: string): Promise<Client> => {
    return fetchApi(`${API_BASE}/clients/${tenantId}/${clientId}`);
};

export const addClient = (tenantId: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>>): Promise<Client> => {
  return fetchApi(`${API_BASE}/clients/${tenantId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateClient = (tenantId: string, clientId: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>>): Promise<Client> => {
  return fetchApi(`${API_BASE}/clients/${tenantId}/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteClient = (tenantId: string, clientId: string): Promise<{ message: string }> => {
  return fetchApi(`${API_BASE}/clients/${tenantId}/${clientId}`, {
    method: 'DELETE',
  });
};
