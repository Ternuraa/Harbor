import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './TripDetailsModal.module.scss';
import type { Booking } from '../../../../../types/search';
import type { Property } from '../../../../../types/property';
import type { Language } from '../../../../../i18n/types';
import { useTranslation } from '../../../../../i18n/useTranslation';
import { formatDateLabel, parseISODate, calculateNights } from '../../../../../utils/searchParams';
import { formatMoney, resolveBookingPriceDetails } from '../../../../../utils/bookingPricing';
import { formatPerNight, getLocaleForNumber, getNightLabel } from '../../../../../utils/localizeProperty';

interface TripDetailsModalProps {
    isOpen: boolean;
    booking: Booking | null;
    property?: Property;
    tripTitle: string;
    location?: string;
    onClose: () => void;
    onCancel: (bookingId: number) => void;
    isCancelling: boolean;
    cancelError: string;
    canCancel?: boolean;
}

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

const buildGuestSummary = (
    booking: Booking,
    language: Language,
    labels: {
        adultOne: string;
        adultFew: string;
        adultMany: string;
    },
) => {
    const adultsLabel = getPlural(booking.adults, language, labels.adultOne, labels.adultFew, labels.adultMany);
    return `${booking.adults} ${adultsLabel}`;
};

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
    isOpen,
    booking,
    property,
    tripTitle,
    location,
    onClose,
    onCancel,
    isCancelling,
    cancelError,
    canCancel = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const { language, dictionary } = useTranslation();
    const labels = dictionary.profile.trips.detailsModal;
    const tripLabels = dictionary.profile.trips;
    const locale = getLocaleForNumber(language);

    useEffect(() => {
        if (isOpen) return;
        setIsCancelConfirmOpen(false);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const checkIn = booking ? parseISODate(booking.checkIn) : null;
    const checkOut = booking ? parseISODate(booking.checkOut) : null;
    const nights = calculateNights(checkIn, checkOut);
    const nightLabel = getNightLabel(nights, language);

    const priceData = useMemo(() => {
        if (!booking) return null;

        const resolved = resolveBookingPriceDetails(booking, checkIn, checkOut, property);
        if (!resolved) return null;

        const perNightLine = resolved.pricePerNight > 0
            ? labels.perNightLine
                .replace('{price}', formatPerNight(resolved.pricePerNight, language))
                .replace('{nights}', String(resolved.nights))
                .replace('{nightLabel}', nightLabel)
            : null;

        return {
            perNightLine,
            subtotal: resolved.subtotal,
            taxes: resolved.taxes,
            showTaxes: resolved.showTaxes,
        };
    }, [booking, property, checkIn, checkOut, nightLabel, language, labels.perNightLine]);

    if (!isOpen || !booking) return null;

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    const displayTitle = booking.propertyTitle || tripTitle;
    const displayLocation = booking.propertyLocation || location;
    const guestSummary = buildGuestSummary(booking, language, tripLabels);

    const handleDownloadReceipt = () => {
        window.print();
    };

    const handleCancel = () => {
        if (isCancelling) return;
        setIsCancelConfirmOpen(true);
    };

    const handleConfirmCancel = () => {
        if (isCancelling || !booking) return;
        onCancel(booking.id);
        setIsCancelConfirmOpen(false);
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
            <div
                ref={modalRef}
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="trip-details-title"
            >
                <button
                    type="button"
                    className={styles.closeBtn}
                    aria-label={labels.close}
                    onClick={onClose}
                >
                    ×
                </button>

                <div className={styles.content}>
                    <h2 id="trip-details-title" className={styles.title}>{labels.title}</h2>

                    <div className={styles.detailsGrid}>
                        <div className={styles.detailsItem}>
                            <h3 className={styles.detailsLabel}>{labels.property}</h3>
                            <p className={styles.detailsValue}>{displayTitle}</p>
                            {displayLocation && (
                                <p className={styles.detailsSubvalue}>{displayLocation}</p>
                            )}
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.datesGrid}>
                            <div className={styles.detailsItem}>
                                <h3 className={styles.detailsLabel}>{labels.checkIn}</h3>
                                <p className={styles.detailsValue}>
                                    {formatDateLabel(checkIn, language, booking.checkIn)}
                                </p>
                                <span className={styles.detailsHint}>{labels.checkInHint}</span>
                            </div>
                            <div className={styles.detailsItem}>
                                <h3 className={styles.detailsLabel}>{labels.checkOut}</h3>
                                <p className={styles.detailsValue}>
                                    {formatDateLabel(checkOut, language, booking.checkOut)}
                                </p>
                                <span className={styles.detailsHint}>{labels.checkOutHint}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.detailsItem}>
                            <h3 className={styles.detailsLabel}>{labels.guests}</h3>
                            <p className={styles.detailsValue}>{guestSummary}</p>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.detailsItem}>
                            <h3 className={`${styles.detailsLabel} ${styles.priceSectionLabel}`}>
                                {labels.priceBreakdown}
                            </h3>
                            {priceData?.perNightLine && priceData.subtotal != null && (
                                <div className={styles.priceRow}>
                                    <span>{priceData.perNightLine}</span>
                                    <span>{formatMoney(priceData.subtotal, locale)}</span>
                                </div>
                            )}
                            {priceData?.showTaxes && (
                                <div className={styles.priceRow}>
                                    <span>{labels.taxes}</span>
                                    <span>{formatMoney(priceData.taxes, locale)}</span>
                                </div>
                            )}
                            <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                                <span>{labels.totalRub}</span>
                                <span>{formatMoney(booking.totalPrice, locale)}</span>
                            </div>
                        </div>

                        {cancelError && (
                            <p className={styles.errorText}>{cancelError}</p>
                        )}

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.receiptBtn}
                                onClick={handleDownloadReceipt}
                            >
                                {labels.downloadReceipt}
                            </button>
                            {canCancel && (
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={handleCancel}
                                    disabled={isCancelling}
                                >
                                    {labels.cancelBooking}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {isCancelConfirmOpen && (
                    <div
                        className={styles.confirmOverlay}
                        onClick={(event) => event.stopPropagation()}
                        role="presentation"
                    >
                        <div
                            className={styles.confirmModal}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="cancel-booking-title"
                            aria-describedby="cancel-booking-text"
                        >
                            <h3 id="cancel-booking-title" className={styles.confirmTitle}>
                                {labels.cancelConfirmTitle}
                            </h3>
                            <p id="cancel-booking-text" className={styles.confirmText}>
                                {labels.cancelConfirmText}
                            </p>
                            <div className={styles.confirmActions}>
                                <button
                                    type="button"
                                    className={styles.confirmYesBtn}
                                    onClick={handleConfirmCancel}
                                    disabled={isCancelling}
                                >
                                    {labels.cancelConfirmYes}
                                </button>
                                <button
                                    type="button"
                                    className={styles.confirmNoBtn}
                                    onClick={() => setIsCancelConfirmOpen(false)}
                                    disabled={isCancelling}
                                >
                                    {labels.cancelConfirmNo}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
