import React from 'react';

import styles from './FilterSidebar.module.scss';

import { FilterSection } from './FilterSection';

import { FilterCheckbox } from './FilterCheckbox';

import { PriceRangeFilter } from './PriceRangeFilter';

import type { Property } from '../../../types/property';

import type { PriceBounds, SearchFiltersState } from '../../../utils/searchFilters';

import {

    AMENITY_IDS,

    PROPERTY_TYPE_IDS,

    RATING_IDS,

    countByAmenity,

    countByMinRating,

    countByPropertyType,

    countNoCommission,

    countVerified,

    hasActiveFilters,

} from '../../../utils/searchFilters';

import { useTranslation } from '../../../i18n/useTranslation';



interface FilterSidebarProps {
    properties: Property[];
    filters: SearchFiltersState;
    priceBounds: PriceBounds;
    onFiltersChange: (filters: SearchFiltersState) => void;
    variant?: 'sidebar' | 'panel';
    onClose?: () => void;
}



const toggleListValue = (list: string[], value: string) =>

    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];



export const FilterSidebar: React.FC<FilterSidebarProps> = ({

    properties,

    filters,

    priceBounds,

    onFiltersChange,

    variant = 'sidebar',

    onClose,

}) => {

    const { t, dictionary } = useTranslation();

    const filterLabels = dictionary.filters;



    const updateFilters = (patch: Partial<SearchFiltersState>) => {

        onFiltersChange({ ...filters, ...patch });

    };



    const handleReset = () => {

        onFiltersChange({

            priceMin: priceBounds.min,

            priceMax: priceBounds.max,

            propertyTypes: [],

            amenities: [],

            minRating: null,

            verifiedOnly: false,

            noCommissionOnly: false,

        });

    };



    return (

        <aside className={`${styles.sidebar} ${variant === 'panel' ? styles.panel : ''}`}>

            <div className={styles.header}>

                <h2 className={styles.title}>{t('filters.title')}</h2>

                <div className={styles.headerActions}>

                    {hasActiveFilters(filters, priceBounds) && (

                        <button type="button" className={styles.resetButton} onClick={handleReset}>

                            {t('filters.reset')}

                        </button>

                    )}

                    {variant === 'panel' && onClose && (

                        <button

                            type="button"

                            className={styles.closeButton}

                            onClick={onClose}

                            aria-label={t('filters.close')}

                        >

                            ×

                        </button>

                    )}

                </div>

            </div>



            <div className={styles.body}>

                <FilterSection title={t('filters.budget')}>

                    <PriceRangeFilter

                        min={priceBounds.min}

                        max={priceBounds.max}

                        valueMin={filters.priceMin}

                        valueMax={filters.priceMax}

                        onChange={(priceMin, priceMax) => updateFilters({ priceMin, priceMax })}

                    />

                </FilterSection>



                <FilterSection title={t('filters.popular')}>

                    <FilterCheckbox

                        label={t('filters.noCommission')}

                        count={countNoCommission(properties)}

                        checked={filters.noCommissionOnly}

                        onChange={(checked) => updateFilters({ noCommissionOnly: checked })}

                    />

                    <FilterCheckbox

                        label={t('filters.verified')}

                        count={countVerified(properties)}

                        checked={filters.verifiedOnly}

                        onChange={(checked) => updateFilters({ verifiedOnly: checked })}

                    />

                </FilterSection>



                <FilterSection title={t('filters.rating')}>

                    {RATING_IDS.map((ratingId) => (

                        <FilterCheckbox

                            key={ratingId}

                            label={filterLabels.ratings[String(ratingId) as '4.5' | '4' | '3.5']}

                            count={countByMinRating(properties, ratingId)}

                            checked={filters.minRating === ratingId}

                            onChange={(checked) =>

                                updateFilters({ minRating: checked ? ratingId : null })

                            }

                        />

                    ))}

                </FilterSection>



                <FilterSection title={t('filters.propertyType')}>

                    {PROPERTY_TYPE_IDS.map((typeId) => (

                        <FilterCheckbox

                            key={typeId}

                            label={filterLabels.propertyTypes[typeId]}

                            count={countByPropertyType(properties, typeId)}

                            checked={filters.propertyTypes.includes(typeId)}

                            onChange={() =>

                                updateFilters({

                                    propertyTypes: toggleListValue(filters.propertyTypes, typeId),

                                })

                            }

                        />

                    ))}

                </FilterSection>



                <FilterSection title={t('filters.amenitiesTitle')} isLast>

                    {AMENITY_IDS.map((amenityId) => (

                        <FilterCheckbox

                            key={amenityId}

                            label={filterLabels.amenities[amenityId]}

                            count={countByAmenity(properties, amenityId)}

                            checked={filters.amenities.includes(amenityId)}

                            onChange={() =>

                                updateFilters({

                                    amenities: toggleListValue(filters.amenities, amenityId),

                                })

                            }

                        />

                    ))}

                </FilterSection>

            </div>



            {variant === 'panel' && onClose && (

                <div className={styles.footer}>

                    <button type="button" className={styles.doneButton} onClick={onClose}>

                        {t('filters.done')}

                    </button>

                </div>

            )}

        </aside>

    );

};

