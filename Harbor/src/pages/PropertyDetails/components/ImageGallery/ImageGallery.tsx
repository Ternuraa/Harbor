import React, { useState } from 'react';
import styles from './ImageGallery.module.scss';
import { GalleryModal } from './GalleryModal';
import { CardImageCarousel } from '../../../../components/ui/CardImageCarousel/CardImageCarousel';
import { ResponsiveImage } from '../../../../components/ui/ResponsiveImage/ResponsiveImage';
import { ShowAllPhotosButton } from '../../../../components/ui/ShowAllPhotosButton/ShowAllPhotosButton';
import { useTranslation } from '../../../../i18n/useTranslation';

interface ImageGalleryProps {
    images: string[];
    title: string;
    onBookNow: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title, onBookNow }) => {
    const { t } = useTranslation();
    const [modalStartIndex, setModalStartIndex] = useState<number | null>(null);
    const safeImages = images && images.length > 0 ? images : ['/images/properties/1/card.webp'];

    return (
        <section className={styles.galleryWrapper} aria-label={title}>
            <div className={styles.mobileCarousel}>
                <CardImageCarousel images={safeImages} alt={title} />
            </div>

            <div className={styles.galleryGrid}>
                <button
                    type="button"
                    className={styles.mainPhotoWrapper}
                    onClick={() => setModalStartIndex(0)}
                    aria-label={t('gallery.mainPhotoAlt')}
                >
                    <ResponsiveImage
                        src={safeImages[0]}
                        alt={t('gallery.mainPhotoAlt')}
                        className={styles.mainPhoto}
                        loading="eager"
                        fetchPriority="high"
                    />
                </button>

                <div className={styles.sidePhotos}>
                    <button
                        type="button"
                        className={styles.sidePhotoWrapper}
                        onClick={() => setModalStartIndex(1)}
                        aria-label={t('gallery.interiorAlt')}
                    >
                        <ResponsiveImage
                            src={safeImages[1] || safeImages[0]}
                            alt={t('gallery.interiorAlt')}
                            className={styles.sidePhoto}
                        />
                    </button>

                    <div className={styles.sidePhotoWrapper}>
                        <button
                            type="button"
                            className={styles.photoButton}
                            onClick={() => setModalStartIndex(2)}
                            aria-label={t('gallery.interiorAlt')}
                        >
                            <ResponsiveImage
                                src={safeImages[2] || safeImages[0]}
                                alt={t('gallery.interiorAlt')}
                                className={styles.sidePhoto}
                            />
                        </button>
                        <div className={styles.overlay}>
                            <ShowAllPhotosButton
                                onClick={() => setModalStartIndex(safeImages.length > 3 ? 3 : 0)}
                            >
                                {t('gallery.showAll')}
                            </ShowAllPhotosButton>
                        </div>
                    </div>
                </div>
            </div>

            {modalStartIndex !== null && (
                <GalleryModal
                    images={safeImages}
                    title={title}
                    onClose={() => setModalStartIndex(null)}
                    onBookNow={onBookNow}
                    initialIndex={modalStartIndex}
                />
            )}
        </section>
    );
};
