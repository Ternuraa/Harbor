import React, { useState } from 'react';
import styles from './ReviewsSection.module.scss';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from '../../../i18n/useTranslation';
import { getLocaleForNumber } from '../../../utils/localizeProperty';

export const ReviewsSection: React.FC<{ rating: number; reviewsCount: number }> = ({
    rating,
    reviewsCount,
}) => {
    const { t, language, dictionary } = useTranslation();
    const locale = getLocaleForNumber(language);
    const [activeFilter, setActiveFilter] = useState('new');
    const formattedRating = language === 'en'
        ? rating.toString()
        : rating.toString().replace('.', ',');
    const mockReviews = dictionary.reviews.items.map((item, index) => ({
        id: index + 1,
        ...item,
    }));

    return (
        <section className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>{t('reviews.title')}</h2>
            <div className={styles.header}>
                <span className={styles.ratingBadge}>★ {formattedRating}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.reviewsCount}>
                    {reviewsCount.toLocaleString(locale)} {t('property.reviews')}
                </span>
            </div>

            <div className={styles.filters}>
                <button
                    type="button"
                    className={`${styles.filterBtn} ${activeFilter === 'new' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('new')}
                >
                    {t('reviews.newest')}
                </button>
                <button
                    type="button"
                    className={`${styles.filterBtn} ${activeFilter === 'high' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('high')}
                >
                    {t('reviews.topRated')}
                </button>
            </div>

            <div className={styles.grid}>
                {mockReviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.authorHeader}>
                            <div className={styles.avatarPlaceholder}>{review.avatarInitial}</div>

                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>{review.author}</div>
                                <div className={styles.reviewDate}>{review.date}</div>
                            </div>
                        </div>
                        <p className={styles.reviewText}>{review.text}</p>
                    </div>
                ))}
            </div>

            <Button className={styles.showAllBtn} fullWidth={false} variant="outline">
                {t('reviews.showAll')}
            </Button>
        </section>
    );
};
