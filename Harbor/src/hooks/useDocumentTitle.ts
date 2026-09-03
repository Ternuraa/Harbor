import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

const SITE_NAME = 'Харбор';

export const useDocumentTitle = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const titles: Record<string, string> = {
            '/': t('pageTitle.home'),
            '/login': t('pageTitle.login'),
            '/register': t('pageTitle.register'),
            '/profile': t('pageTitle.profile'),
            '/search': t('pageTitle.search'),
            '/favorites': t('pageTitle.favorites'),
            '/privacy': t('pageTitle.privacy'),
            '/terms': t('pageTitle.terms'),
            '/sitemap': t('pageTitle.sitemap'),
            '/about': t('pageTitle.about'),
            '/news': t('pageTitle.news'),
            '/cancellation-policy': t('pageTitle.cancellation'),
            '/guest-safety': t('pageTitle.guestSafety'),
            '/contact': t('pageTitle.contact'),
            '/list-your-space': t('pageTitle.listYourSpace'),
            '/host-protection': t('pageTitle.hostProtection'),
            '/host-resources': t('pageTitle.hostResources'),
            '/ui-kit': t('pageTitle.uiKit'),
        };

        if (pathname.startsWith('/property/') && pathname.endsWith('/book')) {
            document.title = `${t('pageTitle.booking')} — ${SITE_NAME}`;
            return;
        }

        if (pathname.startsWith('/property/')) {
            document.title = `${t('pageTitle.property')} — ${SITE_NAME}`;
            return;
        }

        if (pathname.startsWith('/ideas/')) {
            document.title = `${t('pageTitle.tripIdea')} — ${SITE_NAME}`;
            return;
        }

        if (pathname.startsWith('/news/')) {
            document.title = `${t('pageTitle.newsArticle')} — ${SITE_NAME}`;
            return;
        }

        document.title = titles[pathname] ?? SITE_NAME;
    }, [pathname, t]);
};
