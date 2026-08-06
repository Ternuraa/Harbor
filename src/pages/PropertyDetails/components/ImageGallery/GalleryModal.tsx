import React, { useEffect, useState } from 'react';
import styles from './ImageGallery.module.scss';
import { ArrowButton } from '../../../../components/ui/ArrowButton/ArrowButton';
import { ResponsiveImage } from '../../../../components/ui/ResponsiveImage/ResponsiveImage';
import { useTranslation } from '../../../../i18n/useTranslation';

interface GalleryModalProps {
    images: string[];
    title: string;
    onClose: () => void;
    onBookNow: () => void;
    initialIndex?: number;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
    images,
    title,
    onClose,
    onBookNow,
    initialIndex = 0,
}) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const handleNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleBook = () => {
        onClose();
        onBookNow();
    };

    return (
        <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
        >
            <header className={styles.modalHeader}>
                <button type="button" className={styles.backBtn} onClick={onClose}>
                    {t('gallery.back')}
                </button>
                <h2 id="gallery-modal-title" className={styles.modalTitle}>{title}</h2>
                <button type="button" className={styles.bookBtn} onClick={handleBook}>
                    {t('gallery.bookNow')}
                </button>
            </header>

            <main className={styles.modalBody}>
                <div className={styles.modalArrowLeft}>
                    <ArrowButton direction="left" onClick={handlePrev} />
                </div>
                <div className={styles.mainImageContainer}>
                    <img
                        src={images[currentIndex]}
                        alt={title}
                        className={styles.modalImage}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <div className={styles.modalArrowRight}>
                    <ArrowButton direction="right" onClick={handleNext} />
                </div>
            </main>

            <footer className={styles.thumbnailsContainer}>
                {images.map((img, index) => (
                    <button
                        key={img}
                        type="button"
                        className={`${styles.thumbnailButton} ${index === currentIndex ? styles.thumbnailButtonActive : ''}`}
                        aria-label={`${title} ${index + 1}`}
                        aria-current={index === currentIndex ? 'true' : undefined}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <ResponsiveImage
                            src={img}
                            alt=""
                            className={styles.thumbnailImage}
                        />
                    </button>
                ))}
            </footer>
        </div>
    );
};
