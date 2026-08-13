import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from 'react';
import {
    clearAuthSession,
    getAuthSession,
    saveAuthSession,
} from '../utils/authStorage';
import { normalizeUserId } from '../utils/favorites';
import {
    clearStoredAvatarUrl,
    getStoredAvatarUrl,
    processAvatarFile,
    saveStoredAvatarUrl,
} from '../utils/userAvatarStorage';

export interface AuthUser {
    id: number;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    registrationYear?: number;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    avatarUrl: string | null;
    login: (token: string, userData: AuthUser, remember?: boolean) => void;
    logout: () => void;
    updateUser: (patch: Partial<AuthUser>) => void;
    setAvatarFromFile: (file: File) => Promise<void>;
    removeAvatar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readAuthSnapshot = (): { user: AuthUser | null; avatarUrl: string | null } => {
    const session = getAuthSession();
    if (!session) return { user: null, avatarUrl: null };

    try {
        const parsedUser = JSON.parse(session.userJson) as AuthUser;
        const normalizedId = normalizeUserId(parsedUser.id);

        if (normalizedId === null) {
            clearAuthSession();
            return { user: null, avatarUrl: null };
        }

        const normalizedUser = { ...parsedUser, id: normalizedId };
        return { user: normalizedUser, avatarUrl: getStoredAvatarUrl(normalizedId) };
    } catch {
        clearAuthSession();
        return { user: null, avatarUrl: null };
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [initialAuth] = useState(readAuthSnapshot);
    const [user, setUser] = useState<AuthUser | null>(initialAuth.user);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth.user !== null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAuth.avatarUrl);
    const userId = user?.id ?? null;

    const persistUser = useCallback((nextUser: AuthUser) => {
        const session = getAuthSession();
        if (!session) return;

        saveAuthSession(session.token, JSON.stringify(nextUser), session.remember);
    }, []);

    const login = (token: string, userData: AuthUser, remember = true) => {
        const normalizedId = normalizeUserId(userData.id) ?? userData.id;
        const normalizedUser: AuthUser = {
            ...userData,
            id: normalizedId,
        };

        saveAuthSession(token, JSON.stringify(normalizedUser), remember);
        setIsAuthenticated(true);
        setUser(normalizedUser);
        setAvatarUrl(getStoredAvatarUrl(normalizedId));
    };

    const logout = () => {
        clearAuthSession();
        setIsAuthenticated(false);
        setUser(null);
        setAvatarUrl(null);
    };

    const updateUser = useCallback((patch: Partial<AuthUser>) => {
        setUser((current) => {
            if (!current) return current;

            const nextUser = { ...current, ...patch };
            persistUser(nextUser);
            return nextUser;
        });
    }, [persistUser]);

    const setAvatarFromFile = useCallback(async (file: File) => {
        if (userId === null) return;

        const dataUrl = await processAvatarFile(file);
        saveStoredAvatarUrl(userId, dataUrl);
        setAvatarUrl(dataUrl);
    }, [userId]);

    const removeAvatar = useCallback(() => {
        if (userId === null) return;

        clearStoredAvatarUrl(userId);
        setAvatarUrl(null);
    }, [userId]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                avatarUrl,
                login,
                logout,
                updateUser,
                setAvatarFromFile,
                removeAvatar,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};
