import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../i18n/types';
import { getStoredLanguage, setStoredLanguage } from '../i18n/languageStorage';

type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next);
        setStoredLanguage(next);
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextValue => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
