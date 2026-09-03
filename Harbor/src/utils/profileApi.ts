import { API_URL } from '../config/api';

const authHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const changePassword = async (
    token: string,
    currentPassword: string,
    newPassword: string,
): Promise<void> => {
    const response = await fetch(`${API_URL}/users/me/password`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Не удалось обновить пароль' }));
        throw new Error(error.error || 'Не удалось обновить пароль');
    }
};
