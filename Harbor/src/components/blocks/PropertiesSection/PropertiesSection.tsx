import React, { useMemo, useRef } from 'react';
import styles from './PropertiesSection.module.scss';
import { PropertyCard } from '../../ui/PropertyCard/PropertyCard';
import { ArrowButton } from '../../ui/ArrowButton/ArrowButton';
import { useSearch } from '../../../context/SearchContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { localizeProperties } from '../../../utils/localizeProperty';
import { filterPropertiesByCity, HOME_PROPERTIES_CITY } from '../../../utils/cityMatch';
import { usePropertiesFromDb } from '../../../utils/loadProperties';
import type { Property } from '../../../types/property';

const filterHomeProperties = (properties: Property[]) =>
    filterPropertiesByCity(properties, HOME_PROPERTIES_CITY);

export const PropertiesSection: React.FC = () => {
    const { buildPropertyUrl } = useSearch();
    const { t, language } = useTranslation();
    const properties = usePropertiesFromDb();
    const cards = useMemo(
        () => localizeProperties(filterHomeProperties(properties), language),
        [properties, language],
    );

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const firstCard = scrollRef.current.querySelector<HTMLElement>(`.${styles.cardWrapper}`);
        if (!firstCard) return;

        const gap = parseFloat(getComputedStyle(scrollRef.current).gap) || 16;
        const scrollAmount = firstCard.offsetWidth + gap;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const canScroll = cards.length > 4;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t('home.propertiesTitle')}</h2>
                {canScroll && (
                    <div className={styles.controls}>
                        <div onClick={() => scroll('left')}>
                            <ArrowButton direction="left" />
                        </div>
                        <div onClick={() => scroll('right')}>
                            <ArrowButton direction="right" />
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.cardsContainer} ref={scrollRef}>
                {cards.map((card) => (
                    <div key={card.id} className={styles.cardWrapper}>
                        <PropertyCard
                            id={card.id}
                            title={card.title}
                            location={card.location}
                            pricePerNight={card.pricePerNight}
                            rating={card.rating}
                            reviewsCount={card.reviewsCount}
                            imageUrl={card.imageUrl}
                            isVerified={card.isVerified}
                            noCommission={card.noCommission}
                            propertyUrl={buildPropertyUrl(card.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};