import { API_URL } from '../config/api';
import { normalizeFavoriteIds } from './favorites';

const authHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

const readFavoriteIds = async (response: Response): Promise<number[]> => {
    const data = await response.json();
    return normalizeFavoriteIds(data.propertyIds);
};

export const fetchFavoriteIds = async (token: string): Promise<number[]> => {
    const response = await fetch(`${API_URL}/favorites`, {
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить избранное');
    }

    return readFavoriteIds(response);
};

export const addFavoriteOnServer = async (token: string, propertyId: number): Promise<number[]> => {
    const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
        throw new Error('Не удалось добавить в избранное');
    }

    return readFavoriteIds(response);
};

export const removeFavoriteOnServer = async (token: string, propertyId: number): Promise<number[]> => {
    const response = await fetch(`${API_URL}/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить из избранного');
    }

    return readFavoriteIds(response);
};
