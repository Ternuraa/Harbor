import type { Language } from './types';

const STORAGE_KEY = 'harbor-language';

export const getStoredLanguage = (): Language => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'en' ? 'en' : 'ru';
    } catch {
        return 'ru';
    }
};

export const setStoredLanguage = (language: Language) => {
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // ignore
    }
};
