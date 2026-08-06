import React, { useCallback, useRef, useState } from 'react';

import styles from './CardImageCarousel.module.scss';
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage';
import { ChevronIcon } from '../icons/ChevronIcon';

interface CardImageCarouselProps {
    images: string[];
    alt: string;
    className?: string;
    allowClickThrough?: boolean;
    /** cover — обрезка (карточки), contain — фото целиком (галерея объекта) */
    objectFit?: 'cover' | 'contain';
}

const stopCardNavigation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
};

export const CardImageCarousel: React.FC<CardImageCarouselProps> = ({
    images,
    alt,
    className,
    allowClickThrough = false,
    objectFit = 'cover',
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const touchStateRef = useRef({ startX: 0, swiped: false });
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = images.length > 0 ? images : [];
    const rootClassName = [
        styles.carousel,
        objectFit === 'contain' ? styles.fitContain : undefined,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const updateIndex = useCallback(() => {
        const track = trackRef.current;
        if (!track || track.clientWidth === 0) return;

        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
    }, [slides.length]);

    const scrollToIndex = useCallback((index: number) => {
        const track = trackRef.current;
        if (!track) return;

        const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
        track.scrollTo({ left: nextIndex * track.clientWidth, behavior: 'smooth' });
        setActiveIndex(nextIndex);
    }, [slides.length]);

    const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopCardNavigation(event);
        scrollToIndex(activeIndex - 1);
    };

    const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopCardNavigation(event);
        scrollToIndex(activeIndex + 1);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!allowClickThrough) {
            stopCardNavigation(event);
            return;
        }

        touchStateRef.current = {
            startX: event.touches[0]?.clientX ?? 0,
            swiped: false,
        };
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!allowClickThrough) {
            stopCardNavigation(event);
            return;
        }

        const deltaX = Math.abs((event.touches[0]?.clientX ?? 0) - touchStateRef.current.startX);
        if (deltaX > 8) {
            touchStateRef.current.swiped = true;
        }
    };

    const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!allowClickThrough) {
            stopCardNavigation(event);
            return;
        }

        if (touchStateRef.current.swiped) {
            stopCardNavigation(event);
            touchStateRef.current.swiped = false;
        }
    };

    if (slides.length === 0) return null;

    if (slides.length === 1) {
        return (
            <div className={rootClassName}>
                <ResponsiveImage src={slides[0]} alt={alt} className={styles.singleImage} />
            </div>
        );
    }

    const canGoPrev = activeIndex > 0;
    const canGoNext = activeIndex < slides.length - 1;

    return (
        <div className={rootClassName}>
            <div
                ref={trackRef}
                className={styles.track}
                onScroll={updateIndex}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onClick={handleTrackClick}
            >
                {slides.map((src, index) => (
                    <div key={`${src}-${index}`} className={styles.slide}>
                        <ResponsiveImage
                            src={src}
                            alt={`${alt} — ${index + 1}`}
                            className={styles.image}
                        />
                    </div>
                ))}
            </div>

            <button
                type="button"
                className={`${styles.navButton} ${styles.navPrev}`}
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="Предыдущее фото"
            >
                <ChevronIcon className={styles.navIcon} aria-hidden />
            </button>

            <button
                type="button"
                className={`${styles.navButton} ${styles.navNext}`}
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="Следующее фото"
            >
                <ChevronIcon className={styles.navIcon} aria-hidden />
            </button>

            <div className={styles.dots} aria-hidden>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};
