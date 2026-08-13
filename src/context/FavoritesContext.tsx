import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
    getFavorites,
    saveFavorites,
    getPendingFavorite,
    setPendingFavorite,
    clearPendingFavorite,
    normalizeUserId,
} from '../utils/favorites';
import { getAuthSession, getAuthToken } from '../utils/authStorage';
import { addFavoriteOnServer, fetchFavoriteIds, removeFavoriteOnServer } from '../utils/favoritesApi';
import type { FavoritePropertyMeta, FavoritesModalState } from '../types/favorites';
import { FavoritesModal } from '../components/ui/FavoritesModal/FavoritesModal';

const CLOSED_MODAL: FavoritesModalState = {
    isOpen: false,
    propertyId: null,
    propertyTitle: '',
    propertyImageUrl: '',
};

interface FavoritesContextType {
    favoriteIds: number[];
    count: number;
    modal: FavoritesModalState;
    isFavorite: (propertyId: number) => boolean;
    requestFavorite: (propertyId: number, meta: FavoritePropertyMeta) => void;
    closeModal: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const mergeFavoriteIds = (current: number[], synced: number[]) =>
    Array.from(new Set([...current, ...synced]));

const readStoredFavoriteIds = (): number[] => {
    const session = getAuthSession();
    if (!session) return [];

    try {
        const parsedUser = JSON.parse(session.userJson) as { id?: unknown };
        const userId = normalizeUserId(parsedUser.id);
        if (userId === null) return [];
        return getFavorites(userId);
    } catch {
        return [];
    }
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const userId = user?.id ?? null;
    const [favoriteIds, setFavoriteIds] = useState<number[]>(readStoredFavoriteIds);
    const [modal, setModal] = useState<FavoritesModalState>(CLOSED_MODAL);
    const syncQueueRef = useRef(Promise.resolve());

    const enqueueFavoriteSync = useCallback((task: () => Promise<void>) => {
        syncQueueRef.current = syncQueueRef.current.then(task).catch(() => undefined);
        return syncQueueRef.current;
    }, []);

    const updateFavoriteIds = useCallback((userId: number, next: number[] | ((prev: number[]) => number[])) => {
        const normalizedUserId = normalizeUserId(userId);
        if (normalizedUserId === null) return;

        setFavoriteIds((prev) => {
            const resolved = typeof next === 'function' ? next(prev) : next;
            saveFavorites(normalizedUserId, resolved);
            return resolved;
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal(CLOSED_MODAL);
    }, []);

    const openLoginModal = useCallback((propertyId: number, meta: FavoritePropertyMeta) => {
        setPendingFavorite({ propertyId, ...meta });
        setModal({
            isOpen: true,
            propertyId,
            propertyTitle: meta.title,
            propertyImageUrl: meta.imageUrl,
        });
    }, []);

    const syncFavoritesFromServer = useCallback(async (userId: number) => {
        await Promise.resolve();
        const normalizedUserId = normalizeUserId(userId);
        if (normalizedUserId === null) return;

        const local = getFavorites(normalizedUserId);
        setFavoriteIds(local);

        const token = getAuthToken();
        if (!token) return;

        try {
            let serverIds = await fetchFavoriteIds(token);
            const missingOnServer = local.filter((id) => !serverIds.includes(id));

            for (const propertyId of missingOnServer) {
                try {
                    serverIds = await addFavoriteOnServer(token, propertyId);
                } catch {
                    // продолжаем синхронизацию остальных
                }
            }

            try {
                serverIds = await fetchFavoriteIds(token);
            } catch {
                // используем последний известный ответ сервера
            }

            const merged = mergeFavoriteIds(local, serverIds);
            setFavoriteIds(merged);
            saveFavorites(normalizedUserId, merged);
        } catch {
            setFavoriteIds(local);
            saveFavorites(normalizedUserId, local);
        }
    }, []);

    const addFavorite = useCallback(async (propertyId: number) => {
        if (userId === null) return;

        updateFavoriteIds(userId, (prev) => {
            if (prev.includes(propertyId)) return prev;
            return [...prev, propertyId];
        });

        const token = getAuthToken();
        if (!token) return;

        await enqueueFavoriteSync(async () => {
            try {
                const synced = await addFavoriteOnServer(token, propertyId);
                updateFavoriteIds(userId, (prev) => mergeFavoriteIds(prev, synced));
            } catch {
                // оставляем локальное состояние
            }
        });
    }, [userId, updateFavoriteIds, enqueueFavoriteSync]);

    const removeFavorite = useCallback(async (propertyId: number) => {
        if (userId === null) return;

        updateFavoriteIds(userId, (prev) => prev.filter((id) => id !== propertyId));

        const token = getAuthToken();
        if (!token) return;

        await enqueueFavoriteSync(async () => {
            try {
                const synced = await removeFavoriteOnServer(token, propertyId);
                updateFavoriteIds(userId, synced);
            } catch {
                // оставляем локальное состояние
            }
        });
    }, [userId, updateFavoriteIds, enqueueFavoriteSync]);

    useEffect(() => {
        if (!isAuthenticated || userId === null) return;

        const normalizedUserId = normalizeUserId(userId);
        if (normalizedUserId === null) return;

        void syncFavoritesFromServer(normalizedUserId);
    }, [isAuthenticated, userId, syncFavoritesFromServer]);

    useEffect(() => {
        if (!isAuthenticated || userId === null) return;

        const pending = getPendingFavorite();
        if (!pending) return;

        const timer = window.setTimeout(() => {
            clearPendingFavorite();
            void addFavorite(pending.propertyId);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [isAuthenticated, userId, addFavorite]);

    const visibleFavoriteIds = isAuthenticated && userId !== null ? favoriteIds : [];

    const isFavorite = useCallback(
        (propertyId: number) => visibleFavoriteIds.includes(propertyId),
        [visibleFavoriteIds],
    );

    const requestFavorite = useCallback(
        (propertyId: number, meta: FavoritePropertyMeta) => {
            if (!isAuthenticated) {
                openLoginModal(propertyId, meta);
                return;
            }

            if (isFavorite(propertyId)) {
                void removeFavorite(propertyId);
                return;
            }

            void addFavorite(propertyId);
        },
        [isAuthenticated, isFavorite, openLoginModal, addFavorite, removeFavorite],
    );

    const value = useMemo(
        () => ({
            favoriteIds: visibleFavoriteIds,
            count: visibleFavoriteIds.length,
            modal,
            isFavorite,
            requestFavorite,
            closeModal,
        }),
        [visibleFavoriteIds, modal, isFavorite, requestFavorite, closeModal],
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
            <FavoritesModal />
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};
