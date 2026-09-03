import React, { useState, useMemo, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import styles from './SearchResultsPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';

import { FilterSidebar } from '../../components/ui/Filter/FilterSidebar';

import { SearchResultCard } from '../../components/ui/SearchResultCard/SearchResultCard';

import type { Language } from '../../i18n/types';

import { usePropertiesFromDb } from '../../utils/loadProperties';

import { useTranslation } from '../../i18n/useTranslation';

import { localizeProperties } from '../../utils/localizeProperty';

import {

    applySearchFilters,

    createDefaultFilters,

    filterAvailableForDates,

    getPriceBounds,

    hasActiveFilters,

    type SearchFiltersState,

} from '../../utils/searchFilters';

import { parseSearchParams } from '../../utils/searchParams';

import { matchesCity } from '../../utils/cityMatch';



const getVariantsLabel = (count: number, language: Language, one: string, few: string, many: string) => {

    if (language === 'en') {

        return count === 1 ? one : many;

    }



    const mod10 = count % 10;

    const mod100 = count % 100;



    if (mod10 === 1 && mod100 !== 11) return one;

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;

    return many;

};



export const SearchResultsPage: React.FC = () => {

    const [searchParams] = useSearchParams();

    const cityQuery = searchParams.get('city');

    const { checkIn, checkOut } = useMemo(
        () => parseSearchParams(searchParams),
        [searchParams],
    );

    const { t, language, dictionary } = useTranslation();



    const properties = usePropertiesFromDb();

    const [filters, setFilters] = useState<SearchFiltersState | null>(null);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);



    const cityResults = useMemo(() => {
        const byCity = cityQuery
            ? properties.filter((property) => matchesCity(property.city, cityQuery))
            : properties;

        return filterAvailableForDates(byCity, checkIn ?? null, checkOut ?? null);
    }, [cityQuery, properties, checkIn, checkOut]);



    const priceBounds = useMemo(() => getPriceBounds(cityResults), [cityResults]);



    useEffect(() => {

        setFilters(createDefaultFilters(priceBounds));

    }, [priceBounds.min, priceBounds.max, cityQuery]);



    const filteredResults = useMemo(() => {

        if (!filters) return cityResults;

        return applySearchFilters(cityResults, filters);

    }, [cityResults, filters]);



    const localizedResults = useMemo(

        () => localizeProperties(filteredResults, language),

        [filteredResults, language],

    );



    const pageTitle = useMemo(() => {

        const sr = dictionary.searchResults;

        const variants = getVariantsLabel(

            localizedResults.length,

            language,

            sr.variantOne,

            sr.variantFew,

            sr.variantMany,

        );



        if (cityQuery) {

            return sr.foundInCity

                .replace('{city}', cityQuery)

                .replace('{count}', String(localizedResults.length))

                .replace('{variants}', variants);

        }



        return sr.foundAll

            .replace('{count}', String(localizedResults.length))

            .replace('{variants}', variants);

    }, [cityQuery, localizedResults.length, language, dictionary.searchResults]);



    const hasFilterActive = filters ? hasActiveFilters(filters, priceBounds) : false;



    useEffect(() => {

        if (!isFiltersOpen) return;

        document.body.style.overflow = 'hidden';

        return () => {

            document.body.style.overflow = '';

        };

    }, [isFiltersOpen]);



    return (
        <>
            <PageLayout containerClassName={styles.layout}>
                <aside className={styles.sidebarColumn}>
                    {filters && (
                        <FilterSidebar
                            properties={cityResults}
                            filters={filters}
                            priceBounds={priceBounds}
                            onFiltersChange={setFilters}
                        />
                    )}
                </aside>

                <div className={styles.resultsColumn}>
                    <header className={styles.resultsHeader}>
                        <h1 className={styles.pageTitle}>{pageTitle}</h1>

                        {filters && (
                            <button
                                type="button"
                                className={styles.filtersButton}
                                onClick={() => setIsFiltersOpen(true)}
                            >
                                {t('filters.title')}
                                {hasFilterActive && <span className={styles.filtersBadge} aria-hidden />}
                            </button>
                        )}
                    </header>

                    <div className={styles.list}>
                        {localizedResults.length > 0 ? (
                            localizedResults.map((property) => (
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
                                    searchCity={cityQuery ?? ''}
                                />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <h3>{t('searchResults.noResultsTitle')}</h3>
                                <p>{t('searchResults.noResultsHint')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </PageLayout>

            {isFiltersOpen && filters && (
                <div
                    className={styles.filtersOverlay}
                    onClick={() => setIsFiltersOpen(false)}
                    role="presentation"
                >
                    <div
                        className={styles.filtersPanel}
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('filters.title')}
                    >
                        <FilterSidebar
                            properties={cityResults}
                            filters={filters}
                            priceBounds={priceBounds}
                            onFiltersChange={setFilters}
                            variant="panel"
                            onClose={() => setIsFiltersOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );

};


