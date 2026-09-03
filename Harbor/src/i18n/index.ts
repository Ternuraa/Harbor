import type { Language, TranslationDictionary } from './types';
import { ru } from './translations/ru';
import { en } from './translations/en';

export const translations: Record<Language, TranslationDictionary> = {
    ru,
    en,
};

export const getTranslation = (language: Language): TranslationDictionary =>
    translations[language];

export const translate = (language: Language, path: string): string => {
    const parts = path.split('.');
    let current: unknown = translations[language];

    for (const part of parts) {
        if (!current || typeof current !== 'object') return path;
        current = (current as Record<string, unknown>)[part];
    }

    return typeof current === 'string' ? current : path;
};
