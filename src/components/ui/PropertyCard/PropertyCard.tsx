import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PropertyCard.module.scss';
import { HeartButton } from '../HeartButton/HeartButton';
import { Badge } from '../Badge/Badge';
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatPerNight, getLocaleForNumber } from '../../../utils/localizeProperty';

interface PropertyCardProps {
    id: number;
    title: string;
    location: string;
    pricePerNight: number;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    isVerified?: boolean;
    noCommission?: boolean;
    propertyUrl?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
    id, title, location, pricePerNight, rating, reviewsCount, imageUrl,
    isVerified = false, noCommission = false, propertyUrl,
}) => {
    const { t, language } = useTranslation();
    const locale = getLocaleForNumber(language);
    const formattedRating = language === 'en'
        ? rating.toString()
        : rating.toString().replace('.', ',');
    const cardBody = (
        <>
            <div className={styles.imageContainer}>
                <ResponsiveImage src={imageUrl} alt={title} className={styles.image} />
            </div>

            <div className={styles.info}>
                <div className={styles.metaRow}>
                    <span className={styles.ratingBadge}>★ {formattedRating}</span>
                    <span className={styles.reviewsCount}>
                        ({reviewsCount.toLocaleString(locale)} {t('property.reviews')})
                    </span>
                </div>

                <h3 className={styles.title}>{title}</h3>

                <p className={styles.location}>{location}</p>

                <p className={styles.price}>
                    <strong>{formatPerNight(pricePerNight, language)}</strong> {t('property.perNight')}
                </p>

                {noCommission && (
                    <Badge
                        text={t('property.noCommission')}
                        variant="success"
                        className={styles.commissionBadge}
                    />
                )}
            </div>
        </>
    );

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                {isVerified ? (
                    <Badge text={t('property.verified')} variant="verified" />
                ) : (
                    <span />
                )}
                <HeartButton propertyId={id} propertyTitle={title} propertyImageUrl={imageUrl} />
            </div>

            {propertyUrl ? (
                <Link to={propertyUrl} className={styles.cardLink}>
                    {cardBody}
                </Link>
            ) : (
                cardBody
            )}
        </article>
    );
};
