import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useTranslation } from '../../../i18n/useTranslation';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useDocumentTitle();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    return (
        <>
            {!isAuthPage && (
                <a href="#main-content" className="skip-link">
                    {t('common.skipToContent')}
                </a>
            )}
            {children}
        </>
    );
};
