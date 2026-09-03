import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TripsTab.module.scss';
import { Button } from '../../../ui/Button/Button';
import { Badge } from '../../../ui/Badge/Badge';
import { ResponsiveImage } from '../../../ui/ResponsiveImage/ResponsiveImage';
import { useAuth } from '../../../../context/AuthContext';
import { getAuthToken } from '../../../../utils/authStorage';
import { fetchBookings, cancelBooking } from '../../../../utils/bookingsApi';
import { formatDatesRange, parseISODate, calculateNights, isBookingUpcoming } from '../../../../utils/searchParams';
import { useTodayStart } from '../../../../hooks/useTodayStart';
import type { Booking } from '../../../../types/search';
import type { Property } from '../../../../types/property';
import type { Language } from '../../../../i18n/types';
import { usePropertiesFromDb } from '../../../../utils/loadProperties';
import { useTranslation } from '../../../../i18n/useTranslation';
import { getNightLabel, localizeProperty } from '../../../../utils/localizeProperty';
import { TripDetailsModal } from './TripDetailsModal/TripDetailsModal';

const getPlural = (
    count: number,
    language: Language,
    one: string,
    few: string,
    many: string,
) => {
    if (language === 'en') {
        return count === 1 ? one : many;
    }

    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
};

const getShortPropertyType = (type: string | undefined, types: Record<string, string>) => {
    if (!type || !types[type]) return types.apartment?.split(' /')[0] ?? 'Квартира';
    return types[type].split(' /')[0].trim();
};

const buildTripTitle = (
    booking: Booking,
    property: Property | undefined,
    labels: {
        fallbackTitle: string;
        titleWithHost: string;
    },
    propertyTypeLabel: string,
) => {
    if (booking.propertyTitle) return booking.propertyTitle;

    const hostName = booking.hostName ?? property?.host.name;
    if (hostName && propertyTypeLabel) {
        return labels.titleWithHost
            .replace('{type}', propertyTypeLabel)
            .replace('{host}', hostName);
    }

    return property?.title ?? labels.fallbackTitle.replace('{id}', String(booking.propertyId));
};

interface TripsTabProps {
    variant?: 'upcoming' | 'past';
}

export const TripsTab: React.FC<TripsTabProps> = ({ variant = 'upcoming' }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { language, dictionary } = useTranslation();
    const labels = dictionary.profile.trips;
    const todayStart = useTodayStart();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
    const [detailsContext, setDetailsContext] = useState<{
        property?: Property;
        tripTitle: string;
        location?: string;
        canCancel: boolean;
    } | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');

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
            .then((data) => {
                setBookings(data);
                setError('');
            })
            .catch(() => {
                setBookings([]);
                setError(labels.loadError);
            })
            .finally(() => setIsLoading(false));
    }, [isAuthenticated, labels.loadError]);

    const properties = usePropertiesFromDb();

    const propertiesById = useMemo(() => {
        const map = new Map<number, Property>();
        properties.forEach((property) => {
            map.set(property.id, localizeProperty(property, language));
        });
        return map;
    }, [properties, language]);

    const upcomingBookings = useMemo(
        () => bookings.filter((booking) => isBookingUpcoming(booking.checkOut, todayStart)),
        [bookings, todayStart],
    );

    const pastBookings = useMemo(
        () => bookings
            .filter((booking) => !isBookingUpcoming(booking.checkOut, todayStart))
            .sort((a, b) => b.checkOut.localeCompare(a.checkOut)),
        [bookings, todayStart],
    );

    const handleStartSearch = () => {
        navigate('/');
    };

    const handleOpenDetails = (
        booking: Booking,
        context: {
            property?: Property;
            tripTitle: string;
            location?: string;
            canCancel: boolean;
        },
    ) => {
        setDetailsContext(context);
        setDetailsBooking(booking);
        setCancelError('');
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setDetailsBooking(null);
        setDetailsContext(null);
        setCancelError('');
        setIsCancelling(false);
    };

    const handleCancelBooking = async (bookingId: number) => {
        const token = getAuthToken();
        if (!token) return;

        setIsCancelling(true);
        setCancelError('');

        try {
            await cancelBooking(token, bookingId);
            setBookings((prev) => prev.filter((item) => item.id !== bookingId));
            handleCloseDetails();
        } catch {
            setCancelError(labels.detailsModal.cancelError);
        } finally {
            setIsCancelling(false);
        }
    };

    const renderTripCard = (booking: Booking, isPast: boolean) => {
        const property = propertiesById.get(booking.propertyId);
        const checkIn = parseISODate(booking.checkIn);
        const checkOut = parseISODate(booking.checkOut);
        const nights = calculateNights(checkIn, checkOut);
        const nightLabel = getNightLabel(nights, language);
        const propertyTypeKey = booking.propertyType ?? property?.propertyType;
        const propertyTypeLabel = getShortPropertyType(
            propertyTypeKey,
            dictionary.filters.propertyTypes,
        );
        const title = buildTripTitle(booking, property, labels, propertyTypeLabel);
        const imageUrl = booking.propertyImageUrl ?? property?.imageUrl;
        const location = booking.propertyLocation
            ?? (property?.city
                ? `${property.city}, ${dictionary.common.russia}`
                : property?.location);
        const adultsLabel = getPlural(
            booking.adults,
            language,
            labels.adultOne,
            labels.adultFew,
            labels.adultMany,
        );
        const guestMeta = booking.children > 0
            ? `${booking.adults} ${adultsLabel}, ${booking.children + booking.adults} ${getPlural(
                booking.children + booking.adults,
                language,
                labels.guestOne,
                labels.guestFew,
                labels.guestMany,
            )}`
            : `${booking.adults} ${adultsLabel}`;

        const datesText = checkIn && checkOut
            ? formatDatesRange(checkIn, checkOut, language)
            : `${booking.checkIn} – ${booking.checkOut}`;
        const datesLine = labels.datesWithNights
            .replace('{dates}', datesText)
            .replace('{nights}', String(nights))
            .replace('{nightLabel}', nightLabel);

        return (
            <article key={booking.id} className={styles.tripCard}>
                <div className={styles.imageWrap}>
                    {imageUrl && (
                        <ResponsiveImage
                            src={imageUrl}
                            alt={title}
                            className={styles.tripImage}
                        />
                    )}
                </div>

                <div className={styles.tripContent}>
                    <div className={styles.tripHeaderRow}>
                        <div className={styles.tripHeaderMain}>
                            <h2 className={styles.tripTitle}>{title}</h2>
                            {location && (
                                <p className={styles.tripLocation}>{location}</p>
                            )}
                        </div>
                        <Badge
                            text={isPast ? labels.completed : labels.confirmed}
                            variant={isPast ? 'completed' : 'confirmed'}
                            className={styles.statusBadge}
                        />
                    </div>

                    <p className={styles.datesLine}>{datesLine}</p>

                    <p className={styles.tripMeta}>
                        {guestMeta}
                        {' • '}
                        {propertyTypeLabel.toLowerCase()}
                    </p>

                    <div className={styles.tripActions}>
                        <button
                            type="button"
                            className={styles.outlineBtn}
                            onClick={() => handleOpenDetails(booking, {
                                property,
                                tripTitle: title,
                                location,
                                canCancel: !isPast,
                            })}
                        >
                            {labels.tripDetails}
                        </button>
                    </div>
                </div>
            </article>
        );
    };

    if (isLoading) {
        return (
            <div className={styles.tabContainer}>
                <h1 className={styles.sectionTitle}>
                    {variant === 'past' ? labels.pastTitle : labels.title}
                </h1>
                <p className={styles.loadingText}>{labels.loading}</p>
            </div>
        );
    }

    const displayedBookings = variant === 'past' ? pastBookings : upcomingBookings;
    const isPastView = variant === 'past';

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>
                {isPastView ? labels.pastTitle : labels.title}
            </h1>

            {error && displayedBookings.length === 0 && (
                <p className={styles.errorText}>{error}</p>
            )}

            {displayedBookings.length > 0 ? (
                <div className={styles.tripsList}>
                    {displayedBookings.map((booking) => renderTripCard(booking, isPastView))}
                </div>
            ) : (
                !error && (
                    <div className={styles.emptyStateCard}>
                        <h2 className={styles.emptyStateTitle}>
                            {isPastView ? labels.pastEmptyTitle : labels.emptyTitle}
                        </h2>
                        <p className={styles.emptyStateText}>
                            {isPastView ? labels.pastEmptyText : labels.emptyText}
                        </p>

                        {!isPastView && (
                            <div className={styles.buttonWrapper}>
                                <Button type="button" onClick={handleStartSearch}>
                                    {labels.searchCta}
                                </Button>
                            </div>
                        )}
                    </div>
                )
            )}

            <TripDetailsModal
                isOpen={isDetailsOpen}
                booking={detailsBooking}
                property={detailsContext?.property}
                tripTitle={detailsContext?.tripTitle ?? ''}
                location={detailsContext?.location}
                onClose={handleCloseDetails}
                onCancel={handleCancelBooking}
                isCancelling={isCancelling}
                cancelError={cancelError}
                canCancel={detailsContext?.canCancel ?? false}
            />
        </div>
    );
};
