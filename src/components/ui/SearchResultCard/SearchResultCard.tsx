import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SearchResultCard.module.scss';
import { CardImageCarousel } from '../CardImageCarousel/CardImageCarousel';
import { HeartButton } from '../HeartButton/HeartButton';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage';
import { useSearch } from '../../../context/SearchContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { useIsTabletDown } from '../../../hooks/useIsTabletDown';
import { formatPerNight, formatTotalForNights, getLocaleForNumber } from '../../../utils/localizeProperty';
import { calculateTaxForStay, formatMoney } from '../../../utils/bookingPricing';

export interface SearchResultCardProps {
    id: number;
    title: string;
    location: string;
    description: string;
    pricePerNight: number;
    totalPrice: string;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    images?: string[];
    isVerified?: boolean;
    noCommission?: boolean;
    searchCity?: string;
    disableHoverShadow?: boolean;
    navigationFrom?: 'search' | 'favorites';
}

const DEFAULT_NIGHTS = 2;

const truncateDescription = (text: string, maxLength = 140) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
};

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
    id,
    title,
    location,
    description,
    pricePerNight,
    rating,
    reviewsCount,
    imageUrl,
    images,
    isVerified = false,
    noCommission = false,
    searchCity = '',
    disableHoverShadow = false,
    navigationFrom = 'search',
}) => {
    const navigate = useNavigate();
    const isTabletDown = useIsTabletDown();
    const { buildPropertyUrl } = useSearch();
    const { t, language } = useTranslation();
    const locale = getLocaleForNumber(language);
    const propertyUrl = buildPropertyUrl(id);
    const propertyState = { from: navigationFrom, searchCity };
    const formattedRating = language === 'en'
        ? rating.toString()
        : rating.toString().replace('.', ',');
    const totalFormatted = formatTotalForNights(pricePerNight, DEFAULT_NIGHTS, language);
    const taxes = calculateTaxForStay(pricePerNight, DEFAULT_NIGHTS);

    const galleryImages = useMemo(() => {
        const fromProp = images?.filter(Boolean) ?? [];
        if (fromProp.length > 0) return fromProp;
        return imageUrl ? [imageUrl] : [];
    }, [images, imageUrl]);

    const handleViewListing = () => {
        navigate(propertyUrl, { state: propertyState });
    };

    const imageSection = (
        <div className={styles.imageSection}>
            <ResponsiveImage src={imageUrl} alt={title} className={styles.desktopImage} />
            <CardImageCarousel
                images={galleryImages}
                alt={title}
                className={styles.mobileCarousel}
                allowClickThrough={isTabletDown}
            />
            {isVerified && (
                <Badge
                    text={t('property.verified')}
                    variant="verified"
                    className={styles.verifiedBadge}
                />
            )}
        </div>
    );

    const ratingMeta = (
        <div className={styles.metaRow}>
            <span className={styles.ratingBadge}>★ {formattedRating}</span>
            <span className={styles.reviewsCount}>
                ({reviewsCount.toLocaleString(locale)} {t('property.reviews')})
            </span>
        </div>
    );

    const contentSection = (
        <div className={styles.content}>
            {ratingMeta}

            <div className={styles.titleRow}>
                <h2 className={styles.title}>{title}</h2>
            </div>

            <p className={styles.location}>{location}</p>
            <p className={styles.description}>{truncateDescription(description)}</p>
            {noCommission && (
                <Badge text={t('property.noCommission')} variant="success" className={styles.commissionBadge} />
            )}
        </div>
    );

    return (
        <article className={styles.card}>
            <div
                className={`${styles.cardSurface} ${disableHoverShadow ? styles.cardSurfaceNoHoverShadow : ''}`.trim()}
            >
                {isTabletDown ? (
                    <Link to={propertyUrl} state={propertyState} className={styles.contentLink}>
                        {imageSection}
                        {contentSection}
                    </Link>
                ) : (
                    <Link to={propertyUrl} state={propertyState} className={styles.cardLinkContents}>
                        {imageSection}
                        {contentSection}
                    </Link>
                )}

                <div className={styles.aside}>
                    <Link to={propertyUrl} state={propertyState} className={styles.asideLink}>
                        <div className={styles.priceBlock}>
                            <p className={styles.price}>
                                <strong>{formatPerNight(pricePerNight, language)}</strong> {t('property.perNight')}
                            </p>
                            <p className={styles.totalPrice}>{t('property.total')} {totalFormatted}</p>
                            <p className={styles.priceNote}>
                                {noCommission
                                    ? t('property.taxesIncluded')
                                    : t('property.taxesAmount').replace('{amount}', formatMoney(taxes, locale))}
                            </p>
                        </div>
                    </Link>

                    <Button type="button" className={styles.viewButton} onClick={handleViewListing}>
                        {t('property.viewListing')}
                    </Button>
                </div>
            </div>

            <div className={styles.favoriteButton}>
                <HeartButton propertyId={id} propertyTitle={title} propertyImageUrl={imageUrl} />
            </div>
        </article>
    );
};
