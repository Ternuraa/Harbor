const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBER_EMAIL_KEY = 'harbor-remember-email';
const REMEMBER_ME_KEY = 'harbor-remember-me';

export const getRememberedEmail = (): string => {
    try {
        return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? '';
    } catch {
        return '';
    }
};

export const setRememberedEmail = (email: string) => {
    try {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } catch {
        // ignore
    }
};

export const clearRememberedEmail = () => {
    try {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
    } catch {
        // ignore
    }
};

export const getRememberMePreference = (): boolean => {
    try {
        return localStorage.getItem(REMEMBER_ME_KEY) === '1';
    } catch {
        return false;
    }
};

export const setRememberMePreference = (remember: boolean) => {
    try {
        if (remember) {
            localStorage.setItem(REMEMBER_ME_KEY, '1');
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
        }
    } catch {
        // ignore
    }
};

export const saveAuthSession = (token: string, userJson: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, userJson);

    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);
};

export const getAuthSession = (): { token: string; userJson: string; remember: boolean } | null => {
    const persistentToken = localStorage.getItem(TOKEN_KEY);
    const persistentUser = localStorage.getItem(USER_KEY);

    if (persistentToken && persistentUser) {
        return { token: persistentToken, userJson: persistentUser, remember: true };
    }

    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    const sessionUser = sessionStorage.getItem(USER_KEY);

    if (sessionToken && sessionUser) {
        return { token: sessionToken, userJson: sessionUser, remember: false };
    }

    return null;
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
};

export const clearAuthSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
};
