import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TripsTab.module.scss';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { getAuthToken } from '../../utils/authStorage';
import { fetchBookings } from '../../utils/bookingsApi';
import { formatDatesRange, parseISODate } from '../../utils/searchParams';
import type { Booking } from '../../types/search';
import type { Property } from '../../types/property';
import type { Language } from '../../i18n/types';
import { usePropertiesFromDb } from '../../utils/loadProperties';
import { useTranslation } from '../../i18n/useTranslation';
import { getLocaleForNumber, localizeProperty } from '../../utils/localizeProperty';

const getGuestLabel = (count: number, language: Language, one: string, few: string, many: string) => {
    if (language === 'en') {
        return count === 1 ? one : many;
    }

    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
};

export const TripsTab: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { language, dictionary } = useTranslation();
    const labels = dictionary.profile.trips;
    const locale = getLocaleForNumber(language);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setBookings([]);
            setIsLoading(false);
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetchBookings(token)
            .then(setBookings)
            .catch(() => setBookings([]))
            .finally(() => setIsLoading(false));
    }, [isAuthenticated]);

    const properties = usePropertiesFromDb();

    const propertiesById = useMemo(() => {
        const map = new Map<number, Property>();
        properties.forEach((property) => {
            map.set(property.id, localizeProperty(property, language));
        });
        return map;
    }, [properties, language]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return bookings.filter((booking) => {
            const checkOut = parseISODate(booking.checkOut);
            return checkOut ? checkOut >= today : true;
        });
    }, [bookings]);

    const handleStartSearch = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className={styles.tabContainer}>
                <h1 className={styles.sectionTitle}>{labels.title}</h1>
                <p className={styles.loadingText}>{labels.loading}</p>
            </div>
        );
    }

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>{labels.title}</h1>

            {upcomingBookings.length > 0 ? (
                <div className={styles.tripsList}>
                    {upcomingBookings.map((booking) => {
                        const property = propertiesById.get(booking.propertyId);
                        const checkIn = parseISODate(booking.checkIn);
                        const checkOut = parseISODate(booking.checkOut);
                        const guestsCount = booking.adults + booking.children + booking.infants;
                        const guestLabel = getGuestLabel(
                            guestsCount,
                            language,
                            labels.guestOne,
                            labels.guestFew,
                            labels.guestMany,
                        );

                        return (
                            <article key={booking.id} className={styles.tripCard}>
                                {property && (
                                    <img
                                        src={property.imageUrl}
                                        alt={property.title}
                                        className={styles.tripImage}
                                    />
                                )}

                                <div className={styles.tripContent}>
                                    <h3 className={styles.tripTitle}>
                                        {property?.title ?? labels.fallbackTitle.replace('{id}', String(booking.propertyId))}
                                    </h3>
                                    {property && (
                                        <p className={styles.tripLocation}>{property.location}</p>
                                    )}
                                    <p className={styles.tripDates}>
                                        {checkIn && checkOut
                                            ? formatDatesRange(checkIn, checkOut)
                                            : `${booking.checkIn} – ${booking.checkOut}`}
                                    </p>
                                    <p className={styles.tripMeta}>
                                        {guestsCount} {guestLabel}
                                        {' · '}
                                        {booking.totalPrice.toLocaleString(locale)} ₽
                                    </p>

                                    {property && (
                                        <Link to={`/property/${property.id}`} className={styles.tripLink}>
                                            {labels.openProperty}
                                        </Link>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyStateCard}>
                    <h3 className={styles.emptyStateTitle}>{labels.emptyTitle}</h3>
                    <p className={styles.emptyStateText}>{labels.emptyText}</p>

                    <div className={styles.buttonWrapper}>
                        <Button onClick={handleStartSearch}>
                            {labels.searchCta}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
