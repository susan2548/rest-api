import Constants from 'expo-constants';
import axios from 'axios';

/**
 * Point this at your CRUD backend (e.g. the json-server "phone" API).
 *
 * Resolution order:
 * 1. EXPO_PUBLIC_API_URL, if set in a .env file — use this for a real deployed backend.
 * 2. The dev server's own LAN host (Constants.expoConfig.hostUri) with port 3000 — this is
 *    how Expo Go already knows your machine's current IP, so a physical device can reach
 *    the local API without hardcoding an IP that changes with your network.
 * 3. localhost:3000 — fallback for web/simulators running on the same machine as the API.
 */
function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const hostUri = Constants.expoConfig?.hostUri;
  const devHost = hostUri?.split(':')[0];
  if (devHost) return `http://${devHost}:3000`;

  return 'http://localhost:3000';
}

const BASE_URL = resolveBaseUrl();

export type Section = 'CED' | 'TCT';

export interface Phone {
  _id: string;
  name: string;
  tel: string;
  sect: Section;
}

export type PhoneInput = Omit<Phone, '_id'>;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getPhone = () => api.get<Phone[]>('/phone');

export const addPhone = (data: PhoneInput) => api.post<Phone>('/phone', data);

export const editPhone = (id: string, data: PhoneInput) =>
  api.put<Phone>(`/phone/${id}`, data);

export const delPhone = (id: string) => api.delete(`/phone/${id}`);

export default api;
