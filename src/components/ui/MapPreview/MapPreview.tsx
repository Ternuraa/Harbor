import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './MapPreview.module.scss';

export const MapPreview: React.FC = () => {
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city') || 'Санкт-Петербург'; // По умолчанию показываем СПб

    // Кодируем название города для безопасной вставки в URL запроса Google Maps
    const encodedCity = encodeURIComponent(city);

    // Используем стандартный режим embed для карт Google (достаточно для отображения города)
    const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=ТВОЙ_GOOGLE_MAPS_API_KEY&q=${encodedCity}`;

    return (
        <div className={styles.mapContainer}>
            {/* Встраиваем настоящую Google Карту через iframe */}
            <iframe
                className={styles.mapIframe}
                src={googleMapSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Карта: ${city}`}
            ></iframe>

            <div className={styles.overlay}>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodedCity}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapButton}
                >
                    Показать на карте
                </a>
            </div>
        </div>
    );
};