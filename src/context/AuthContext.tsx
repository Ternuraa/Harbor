import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const persistUser = useCallback((nextUser: AuthUser) => {
        const session = getAuthSession();
        if (!session) return;

        saveAuthSession(session.token, JSON.stringify(nextUser), session.remember);
    }, []);

    useEffect(() => {
        const session = getAuthSession();

        if (session) {
            try {
                const parsedUser = JSON.parse(session.userJson) as AuthUser;
                const normalizedId = normalizeUserId(parsedUser.id);

                if (normalizedId === null) {
                    clearAuthSession();
                    return;
                }

                const normalizedUser = { ...parsedUser, id: normalizedId };
                setIsAuthenticated(true);
                setUser(normalizedUser);
                setAvatarUrl(getStoredAvatarUrl(normalizedId));
            } catch {
                clearAuthSession();
            }
        }
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
        if (!user?.id) return;

        const dataUrl = await processAvatarFile(file);
        saveStoredAvatarUrl(user.id, dataUrl);
        setAvatarUrl(dataUrl);
    }, [user?.id]);

    const removeAvatar = useCallback(() => {
        if (!user?.id) return;

        clearStoredAvatarUrl(user.id);
        setAvatarUrl(null);
    }, [user?.id]);

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
