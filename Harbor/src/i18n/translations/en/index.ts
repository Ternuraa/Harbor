import type { TranslationDictionary } from '../../types';
import { enCommon } from './common';
import { enPages } from './pages';
import { enNews } from './news';
import { enUi } from './ui';

export const en: TranslationDictionary = {
    ...enCommon,
    ...enUi,
    pages: enPages,
    news: enNews,
};
