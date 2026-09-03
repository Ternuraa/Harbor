/** Базовый URL API. Локально — /api (прокси Vite), на хостинге — VITE_API_URL из .env */
export const API_URL = import.meta.env.VITE_API_URL ?? '/api';
