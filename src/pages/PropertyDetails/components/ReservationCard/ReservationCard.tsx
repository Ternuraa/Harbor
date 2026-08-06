import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ReservationCard.module.scss';
import { DatePicker } from '../../../../components/ui/DatePicker/DatePicker';
import { GuestPicker, type GuestsState } from '../../../../components/ui/GuestPicker/GuestPicker';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { BookingEditModal } from '../../../BookingRequestPage/components/BookingEditModal';
import { useSearch } from '../../../../context/SearchContext';
import { useAuth } from '../../../../context/AuthContext';
import {
    calculateNights,
    formatDateLabel,
    formatGuestsLabel,
} from '../../../../utils/searchParams';
import { calculateBookingBreakdown, formatMoney } from '../../../../utils/bookingPricing';
import { isPropertyBookedForRange, isPropertyBookedOnDate, rangeIncludesBookedDate } from '../../../../utils/propertyBookings';
import type { BookedDateRange } from '../../../../types/property';
import { useTranslation } from '../../../../i18n/useTranslation';
import { formatPerNight, getLocaleForNumber, getNightLabel } from '../../../../utils/localizeProperty';

interface ReservationCardProps {
    propertyId: number;
    pricePerNight: number;
    bookedDates: BookedDateRange[];
    noCommission?: boolean;
}

type EditModal = 'dates' | 'guests' | null;

export interface ReservationCardHandle {
    handleReserve: () => void;
}

export const ReservationCard = forwardRef<ReservationCardHandle, ReservationCardProps>(({
    propertyId,
    pricePerNight,
    bookedDates,
    noCommission = false,
}, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { language, dictionary, t } = useTranslation();
    const isMobile = useIsMobile();
    const br = dictionary.bookingRequest;
    const locale = getLocaleForNumber(language);
    const { checkIn, checkOut, guests, setDates, setGuests, buildBookingUrl } = useSearch();

    const [activeEditModal, setActiveEditModal] = useState<EditModal>(null);
    const [draftCheckIn, setDraftCheckIn] = useState<Date | null>(checkIn);
    const [draftCheckOut, setDraftCheckOut] = useState<Date | null>(checkOut);
    const [draftGuests, setDraftGuests] = useState<GuestsState>(guests);
    const [dateFlexibility, setDateFlexibility] = useState('exact');
    const [dateActiveTab, setDateActiveTab] = useState('dates');
    const [flexDuration, setFlexDuration] = useState('weekend');
    const [selectedFlexMonths, setSelectedFlexMonths] = useState<Date[]>([]);
    const [error, setError] = useState('');

    const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);
    const breakdown = useMemo(
        () => calculateBookingBreakdown(pricePerNight, checkIn, checkOut, noCommission),
        [pricePerNight, checkIn, checkOut, noCommission],
    );

    const guestsLabel = formatGuestsLabel(guests, language);
    const addDateLabel = t('header.addDate');
    const hasGuests = guests.adults > 0 || guests.children > 0;
    const nightLabel = getNightLabel(nights, language);

    const isDateDisabled = useCallback(
        (date: Date) => isPropertyBookedOnDate(bookedDates, date),
        [bookedDates],
    );

    const openDatesModal = useCallback(() => {
        setDraftCheckIn(checkIn);
        setDraftCheckOut(checkOut);
        setActiveEditModal('dates');
        setError('');
    }, [checkIn, checkOut]);

    const openGuestsModal = useCallback(() => {
        setDraftGuests(guests);
        setActiveEditModal('guests');
        setError('');
    }, [guests]);

    const closeEditModal = () => setActiveEditModal(null);

    const saveDates = () => {
        if (!draftCheckIn || !draftCheckOut) return;

        if (rangeIncludesBookedDate(bookedDates, draftCheckIn, draftCheckOut)) {
            setError(t('property.errorBooked'));
            return;
        }

        setError('');
        setDates({ start: draftCheckIn, end: draftCheckOut });
        closeEditModal();
    };

    const saveGuests = () => {
        if (draftGuests.adults + draftGuests.children === 0) return;
        setGuests(draftGuests);
        closeEditModal();
    };

    const clearDates = () => {
        setDraftCheckIn(null);
        setDraftCheckOut(null);
    };

    const handleReserve = useCallback(() => {
        setError('');

        if (!checkIn || !checkOut) {
            setError(t('property.errorSelectDates'));
            openDatesModal();
            return;
        }

        if (!hasGuests) {
            setError(t('property.errorSelectGuests'));
            openGuestsModal();
            return;
        }

        if (isPropertyBookedForRange(bookedDates, checkIn, checkOut)) {
            setError(t('property.errorBooked'));
            openDatesModal();
            return;
        }

        if (!isAuthenticated) {
            const redirect = encodeURIComponent(location.pathname + location.search);
            navigate(`/login?redirect=${redirect}`);
            return;
        }

        navigate(buildBookingUrl(propertyId));
    }, [
        bookedDates,
        buildBookingUrl,
        checkIn,
        checkOut,
        hasGuests,
        isAuthenticated,
        location.pathname,
        location.search,
        navigate,
        openDatesModal,
        openGuestsModal,
        propertyId,
        t,
    ]);

    useImperativeHandle(ref, () => ({ handleReserve }), [handleReserve]);

    return (
        <>
            <div className={styles.card}>
                <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPerNight(pricePerNight, language)}</span>
                    <span className={styles.unit}>{t('property.perNight')}</span>
                </div>

                <div className={styles.bookingForm}>
                    <div className={styles.datesRow}>
                        <button type="button" className={styles.inputBox} onClick={openDatesModal}>
                            <span className={styles.label}>{t('property.checkIn')}</span>
                            <span className={checkIn ? styles.value : `${styles.value} ${styles.valuePlaceholder}`}>
                                {formatDateLabel(checkIn, language, addDateLabel)}
                            </span>
                        </button>
                        <button type="button" className={styles.inputBox} onClick={openDatesModal}>
                            <span className={styles.label}>{t('property.checkOut')}</span>
                            <span className={checkOut ? styles.value : `${styles.value} ${styles.valuePlaceholder}`}>
                                {formatDateLabel(checkOut, language, addDateLabel)}
                            </span>
                        </button>
                    </div>

                    <button type="button" className={styles.guestBox} onClick={openGuestsModal}>
                        <span className={styles.label}>{t('property.guests')}</span>
                        <span className={hasGuests ? styles.value : `${styles.value} ${styles.valuePlaceholder}`}>
                            {hasGuests ? guestsLabel : t('property.addGuests')}
                        </span>
                    </button>
                </div>

                {nights > 0 && (
                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span>
                                {formatPerNight(pricePerNight, language)} × {nights} {nightLabel}
                            </span>
                            <span>{formatMoney(breakdown.subtotal, locale)}</span>
                        </div>
                        {breakdown.weeklyDiscount > 0 && (
                            <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                                <span>{t('bookingRequest.weeklyDiscount')}</span>
                                <span>−{formatMoney(breakdown.weeklyDiscount, locale)}</span>
                            </div>
                        )}
                        {breakdown.taxesIncluded ? (
                            <p className={styles.priceNote}>{t('property.taxesIncluded')}</p>
                        ) : (
                            <div className={styles.summaryRow}>
                                <span>{t('bookingRequest.taxes')}</span>
                                <span>{formatMoney(breakdown.taxes, locale)}</span>
                            </div>
                        )}
                        <div className={styles.summaryTotal}>
                            <span>{t('property.totalLabel')}</span>
                            <span>{formatMoney(breakdown.total, locale)}</span>
                        </div>
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <button type="button" className={styles.reserveBtn} onClick={handleReserve}>
                    {t('property.reserve')}
                </button>

                <p className={styles.hint}>{t('property.noChargeYet')}</p>
            </div>

            <BookingEditModal
                isOpen={activeEditModal === 'dates'}
                title={br.editDatesTitle}
                onClose={closeEditModal}
                onSave={saveDates}
                saveLabel={br.save}
                onClear={clearDates}
                clearLabel={br.clearDates}
                wide
            >
                <DatePicker
                    isOpen={activeEditModal === 'dates'}
                    onClose={closeEditModal}
                    startDate={draftCheckIn}
                    endDate={draftCheckOut}
                    onChange={({ start, end }) => {
                        setDraftCheckIn(start);
                        setDraftCheckOut(end);
                    }}
                    flexibility={dateFlexibility}
                    onFlexibilityChange={setDateFlexibility}
                    activeTab={dateActiveTab}
                    onTabChange={setDateActiveTab}
                    flexDuration={flexDuration}
                    onFlexDurationChange={setFlexDuration}
                    selectedFlexMonths={selectedFlexMonths}
                    onFlexMonthsChange={setSelectedFlexMonths}
                    isDateDisabled={isDateDisabled}
                    placement="modal"
                    layout={isMobile ? 'scroll' : 'paged'}
                />
            </BookingEditModal>

            <BookingEditModal
                isOpen={activeEditModal === 'guests'}
                title={br.editGuestsTitle}
                onClose={closeEditModal}
                onSave={saveGuests}
                saveLabel={br.save}
                cancelLabel={br.cancel}
            >
                <GuestPicker
                    isOpen={activeEditModal === 'guests'}
                    onClose={closeEditModal}
                    guests={draftGuests}
                    onChange={setDraftGuests}
                    placement="modal"
                />
            </BookingEditModal>
        </>
    );
});

ReservationCard.displayName = 'ReservationCard';
