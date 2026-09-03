import React from 'react';
import styles from './LocationSection.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';

interface Place {
    id: number;
    icon: string;
    name: string;
    time: string;
}

interface LocationDetailsProps {
    locationDetails?: {
        address: string;
        neighborhood: string;
        description: string;
        transport: Place[];
        infrastructure: Place[];
    };
}

export const LocationSection: React.FC<LocationDetailsProps> = ({ locationDetails }) => {
    const { t } = useTranslation();

    const data = locationDetails || {
        address: 'Санкт-Петербург, Ленсовета 22',
        neighborhood: 'Московский район, Санкт-Петербург',
        description: 'Тихий и безопасный район с развитой инфраструктурой, множеством кофеен и скверов для прогулок.',
        transport: [
            { id: 1, icon: '🚇', name: 'Метро «Московская»', time: '5 мин' },
            { id: 2, icon: '🚌', name: 'Остановка «Ленсовета»', time: '2 мин' },
        ],
        infrastructure: [
            { id: 1, icon: '🛒', name: 'ВкусВилл', time: '3 мин' },
            { id: 2, icon: '☕', name: 'Кофейня Surf', time: '10 мин' },
        ],
    };

    const mapQuery = encodeURIComponent(data.address);

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('location.title')}</h2>

            <div className={styles.mapWrapper} id="map">
                <iframe
                    title="Google Map Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
            </div>

            <h3 className={styles.neighborhoodTitle}>{data.neighborhood}</h3>
            <p className={styles.descriptionText}>{data.description}</p>

            <div className={styles.placesGrid}>
                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>{t('location.transport')}</h4>
                    <ul className={styles.list}>
                        {data.transport.map((item) => (
                            <li key={item.id} className={styles.item}>
                                <div className={styles.placeName}>
                                    <span className={styles.icon}>{item.icon}</span>
                                    {item.name}
                                </div>
                                <span className={styles.time}>{item.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>{t('location.infrastructure')}</h4>
                    <ul className={styles.list}>
                        {data.infrastructure.map((item) => (
                            <li key={item.id} className={styles.item}>
                                <div className={styles.placeName}>
                                    <span className={styles.icon}>{item.icon}</span>
                                    {item.name}
                                </div>
                                <span className={styles.time}>{item.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
