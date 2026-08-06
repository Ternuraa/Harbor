import React from 'react';
import { HeartIcon } from '../icons/HeartIcon';
import styles from './HeartButton.module.scss';
import { useFavorites } from '../../../context/FavoritesContext';
import { useTranslation } from '../../../i18n/useTranslation';

interface HeartButtonProps {
    propertyId: number;
    propertyTitle?: string;
    propertyImageUrl?: string;
    className?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
    propertyId,
    propertyTitle = '',
    propertyImageUrl = '',
    className,
}) => {
    const { isFavorite, requestFavorite } = useFavorites();
    const { t } = useTranslation();
    const liked = isFavorite(propertyId);

    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        requestFavorite(propertyId, {
            title: propertyTitle,
            imageUrl: propertyImageUrl,
        });
    };

    return (
        <button
            className={`${styles.button} ${liked ? styles.liked : ''} ${className || ''}`.trim()}
            onClick={toggleLike}
            aria-label={liked ? t('heart.remove') : t('heart.add')}
            aria-pressed={liked}
        >
            <HeartIcon className={styles.icon} />
        </button>
    );
};
