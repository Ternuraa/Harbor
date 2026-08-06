import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './FavoritesPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { SearchResultCard } from '../../components/ui/SearchResultCard/SearchResultCard';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import type { Language } from '../../i18n/types';
import { usePropertiesFromDb } from '../../utils/loadProperties';
import { useTranslation } from '../../i18n/useTranslation';
import { localizeProperties } from '../../utils/localizeProperty';

const getSavedLabel = (count: number, language: Language, one: string, few: string, many: string) => {
    if (language === 'en') {
        return count === 1 ? one : many;
    }

    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
};

export const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { favoriteIds, count } = useFavorites();
    const { t, language, dictionary } = useTranslation();

    const properties = usePropertiesFromDb();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/favorites');
        }
    }, [isAuthenticated, navigate]);

    const favoriteProperties = useMemo(() => {
        const idsSet = new Set(favoriteIds);
        return localizeProperties(
            properties.filter((property) => idsSet.has(property.id)),
            language,
        );
    }, [favoriteIds, properties, language]);

    const savedLabel = getSavedLabel(
        count,
        language,
        dictionary.favorites.savedOne,
        dictionary.favorites.savedFew,
        dictionary.favorites.savedMany,
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <PageLayout>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('favorites.title')}</h1>
                    <p className={styles.subtitle}>
                        {count > 0
                            ? `${count} ${savedLabel}`
                            : t('favorites.emptyHint')}
                    </p>
                </div>
            </header>

            {count === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>♡</div>
                    <h2 className={styles.emptyTitle}>{t('favorites.emptyTitle')}</h2>
                    <p className={styles.emptyText}>{t('favorites.emptyText')}</p>
                    <Link to="/" className={styles.emptyButton}>
                        {t('favorites.searchCta')}
                    </Link>
                </div>
            ) : favoriteProperties.length > 0 ? (
                <div className={styles.list}>
                    {favoriteProperties.map((property) => (
                        <SearchResultCard
                            key={property.id}
                            id={property.id}
                            title={property.title}
                            location={property.location}
                            description={property.description}
                            pricePerNight={property.pricePerNight}
                            totalPrice={property.totalPrice}
                            rating={property.rating}
                            reviewsCount={property.reviewsCount}
                            imageUrl={property.imageUrl}
                            images={property.images}
                            isVerified={property.isVerified}
                            noCommission={property.noCommission}
                            disableHoverShadow
                            navigationFrom="favorites"
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.loadingState}>{t('favorites.loading')}</div>
            )}
        </PageLayout>
    );
};
