const getStorageKey = (userId: number) => `harbor-favorites-${userId}`;
const PENDING_FAVORITE_KEY = 'harbor-pending-favorite';

export const normalizeUserId = (userId: unknown): number | null => {
    if (typeof userId === 'number' && Number.isFinite(userId)) return userId;

    if (typeof userId === 'string' && userId.trim() !== '') {
        const parsed = Number(userId);
        if (Number.isFinite(parsed)) return parsed;
    }

    return null;
};

export const normalizeFavoriteIds = (ids: unknown): number[] => {
    if (!Array.isArray(ids)) return [];

    return ids
        .map((id) => (typeof id === 'number' ? id : Number(id)))
        .filter((id): id is number => Number.isFinite(id));
};

export interface PendingFavorite {
    propertyId: number;
    title: string;
    imageUrl: string;
}

export const getFavorites = (userId: number): number[] => {
    const normalizedUserId = normalizeUserId(userId);
    if (normalizedUserId === null) return [];

    try {
        const raw = localStorage.getItem(getStorageKey(normalizedUserId));
        if (!raw) return [];

        return normalizeFavoriteIds(JSON.parse(raw));
    } catch {
        return [];
    }
};

export const saveFavorites = (userId: number, ids: number[]) => {
    const normalizedUserId = normalizeUserId(userId);
    if (normalizedUserId === null) return;

    try {
        localStorage.setItem(
            getStorageKey(normalizedUserId),
            JSON.stringify(normalizeFavoriteIds(ids)),
        );
    } catch {
        // ignore quota errors
    }
};

export const toggleFavoriteId = (userId: number, propertyId: number): number[] => {
    const current = getFavorites(userId);
    const exists = current.includes(propertyId);
    const updated = exists
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId];

    saveFavorites(userId, updated);
    return updated;
};

export const setPendingFavorite = (pending: PendingFavorite) => {
    try {
        sessionStorage.setItem(PENDING_FAVORITE_KEY, JSON.stringify(pending));
    } catch {
        // ignore
    }
};

export const getPendingFavorite = (): PendingFavorite | null => {
    try {
        const raw = sessionStorage.getItem(PENDING_FAVORITE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as PendingFavorite;
        if (typeof parsed.propertyId !== 'number') return null;

        return parsed;
    } catch {
        return null;
    }
};

export const clearPendingFavorite = () => {
    try {
        sessionStorage.removeItem(PENDING_FAVORITE_KEY);
    } catch {
        // ignore
    }
};
