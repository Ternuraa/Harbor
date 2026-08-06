import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PopularDestinations.module.scss';
import { ResponsiveImage } from '../../ui/ResponsiveImage/ResponsiveImage';
import { useTranslation } from '../../../i18n/useTranslation';
import { destinationImages } from './images';

export const PopularDestinations: React.FC = () => {
    const { dictionary } = useTranslation();
    const home = dictionary.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{home.popularTitle}</h2>
                    <p className={styles.subtitle}>{home.popularSubtitle}</p>
                </div>

                <div className={styles.grid}>
                    {home.destinations.map((dest, index) => (
                        <Link
                            key={dest.city}
                            to={`/search?city=${encodeURIComponent(dest.searchQuery)}`}
                            className={styles.card}
                            aria-label={dest.city}
                        >
                            <ResponsiveImage
                                src={destinationImages[index]}
                                alt={dest.city}
                                className={styles.image}
                            />
                            <div className={styles.overlay}></div>
                            <div className={styles.content}>
                                <h3 className={styles.city}>{dest.city}</h3>
                                {dest.price && <p className={styles.price}>{dest.price}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
