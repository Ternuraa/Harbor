import React, { useCallback, useRef, useState } from 'react';

import styles from './CardImageCarousel.module.scss';
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage';

interface CardImageCarouselProps {
    images: string[];
    alt: string;
}

export const CardImageCarousel: React.FC<CardImageCarouselProps> = ({ images, alt }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = images.length > 0 ? images : [];

    const updateIndex = useCallback(() => {
        const track = trackRef.current;
        if (!track || track.clientWidth === 0) return;

        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
    }, [slides.length]);

    if (slides.length === 0) return null;

    if (slides.length === 1) {
        return (
            <div className={styles.carousel}>
                <ResponsiveImage src={slides[0]} alt={alt} className={styles.singleImage} />
            </div>
        );
    }

    return (
        <div className={styles.carousel}>
            <div
                ref={trackRef}
                className={styles.track}
                onScroll={updateIndex}
                onTouchStart={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
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
