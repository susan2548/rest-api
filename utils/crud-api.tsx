import axios from 'axios';

/**
 * Point this at your CRUD backend (e.g. the Express/MongoDB "phone" API).
 * Override at runtime with EXPO_PUBLIC_API_URL in a .env file if needed.
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

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
