import type { TranslationDictionary } from '../../types';
import { ruCommon } from './common';
import { ruPages } from './pages';
import { ruNews } from './news';
import { ruUi } from './ui';

export const ru: TranslationDictionary = {
    ...ruCommon,
    ...ruUi,
    pages: ruPages,
    news: ruNews,
};
