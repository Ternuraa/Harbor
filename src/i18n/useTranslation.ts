import { enUS, ru } from 'date-fns/locale';
import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, translate } from './index';
import type { InfoPageContent, NewsItemContent } from './types';

export const useTranslation = () => {
    const { language, setLanguage } = useLanguage();
    const dictionary = getTranslation(language);

    const t = (path: string) => translate(language, path);

    const tPage = (pageKey: string): InfoPageContent | undefined =>
        dictionary.pages[pageKey];

    const tNewsItems = (): NewsItemContent[] => dictionary.news.items;

    const tNewsBySlug = (slug: string): NewsItemContent | undefined =>
        dictionary.news.items.find((item) => item.slug === slug);

    const dateLocale = language === 'ru' ? ru : enUS;

    return useMemo(
        () => ({
            language,
            setLanguage,
            t,
            tPage,
            tNewsItems,
            tNewsBySlug,
            dateLocale,
            dictionary,
        }),
        [language, setLanguage, dictionary],
    );
};
