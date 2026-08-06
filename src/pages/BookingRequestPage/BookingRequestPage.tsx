import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { usePropertyFromDb } from '../../utils/loadProperties';
import styles from './BookingRequestPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { BookingRequestSidebar } from './components/BookingRequestSidebar';
import { BookingEditModal } from './components/BookingEditModal';
import { DatePicker } from '../../components/ui/DatePicker/DatePicker';
import { GuestPicker, type GuestsState } from '../../components/ui/GuestPicker/GuestPicker';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { localizeProperty } from '../../utils/localizeProperty';
import { getAuthToken } from '../../utils/authStorage';
import { createBooking } from '../../utils/bookingsApi';
import { calculateBookingBreakdown, formatMoney } from '../../utils/bookingPricing';
import {
    addLoyaltyPoints,
    applyPromoToTotal,
    BOOKING_LOYALTY_REWARD,
    findPromo,
    getDefaultSavedCard,
    type AppliedPromo,
    type SavedCard,
} from '../../utils/paymentsStorage';
import { isPropertyBookedForRange, isPropertyBookedOnDate, rangeIncludesBookedDate } from '../../utils/propertyBookings';
import { toISODate } from '../../utils/searchParams';
import { getLocaleForNumber } from '../../utils/localizeProperty';

type BookingStep = 1 | 2 | 3 | 4;
type PaymentTiming = 'now' | 'later';
type EditModal = 'dates' | 'guests' | null;

const STEP_COUNT = 4;

const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();

const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isValidCard = (number: string, expiry: string, cvv: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.length < 16) return false;
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    if (cvv.length < 3) return false;
    return true;
};

export const BookingRequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { language, dictionary, t } = useTranslation();
    const br = dictionary.bookingRequest;
    const isMobile = useIsMobile();
    const locale = getLocaleForNumber(language);
    const dateLocale = language === 'ru' ? ru : enUS;

    const {
        checkIn,
        checkOut,
        guests,
        buildPropertyUrl,
        setDates,
        setGuests,
    } = useSearch();

    const [activeEditModal, setActiveEditModal] = useState<EditModal>(null);
    const [draftCheckIn, setDraftCheckIn] = useState<Date | null>(checkIn);
    const [draftCheckOut, setDraftCheckOut] = useState<Date | null>(checkOut);
    const [draftGuests, setDraftGuests] = useState<GuestsState>(guests);
    const [dateFlexibility, setDateFlexibility] = useState('exact');
    const [dateActiveTab, setDateActiveTab] = useState('dates');
    const [flexDuration, setFlexDuration] = useState('weekend');
    const [selectedFlexMonths, setSelectedFlexMonths] = useState<Date[]>([]);

    const [currentStep, setCurrentStep] = useState<BookingStep>(1);
    const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('now');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardPostal, setCardPostal] = useState('');
    const [hostMessage, setHostMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [savedCard] = useState<SavedCard | null>(() => getDefaultSavedCard());
    const [useSavedCard, setUseSavedCard] = useState(() => getDefaultSavedCard() !== null);
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
    const [promoError, setPromoError] = useState('');

    const numericId = Number(id);
    const rawProperty = usePropertyFromDb(Number.isFinite(numericId) ? numericId : -1);
    const property = rawProperty ? localizeProperty(rawProperty, language) : undefined;

    const breakdown = useMemo(
        () => calculateBookingBreakdown(
            property?.pricePerNight ?? 0,
            checkIn,
            checkOut,
            property?.noCommission,
        ),
        [property?.pricePerNight, property?.noCommission, checkIn, checkOut],
    );

    const { total: finalTotal, promoDiscount } = useMemo(
        () => applyPromoToTotal(breakdown.total, appliedPromo),
        [breakdown.total, appliedPromo],
    );

    const hasGuests = guests.adults > 0 || guests.children > 0;
    const propertyUrl = property ? buildPropertyUrl(property.id) : '/';

    const isDateDisabled = useCallback(
        (date: Date) => (property ? isPropertyBookedOnDate(property.bookedDates, date) : false),
        [property],
    );

    useEffect(() => {
        if (!isAuthenticated) {
            const redirect = encodeURIComponent(window.location.pathname + window.location.search);
            navigate(`/login?redirect=${redirect}`, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!property || !checkIn || !checkOut || !hasGuests) {
            if (property) {
                navigate(propertyUrl, { replace: true });
            }
        }
    }, [property, checkIn, checkOut, hasGuests, navigate, propertyUrl]);

    if (!property || !checkIn || !checkOut || !hasGuests) {
        return (
            <PageLayout className={styles.bookingPage}>
                <div className={styles.loading}>{t('common.loading')}</div>
            </PageLayout>
        );
    }

    if (isPropertyBookedForRange(property.bookedDates, checkIn, checkOut)) {
        navigate(propertyUrl, { replace: true });
        return null;
    }

    const payLaterDate = format(addDays(checkIn, -7), 'd MMM', { locale: dateLocale });
    const totalFormatted = formatMoney(finalTotal, locale);

    const handleApplyPromo = () => {
        const promo = findPromo(promoInput);
        if (!promo) {
            setAppliedPromo(null);
            setPromoError(br.promoInvalid);
            return;
        }

        setAppliedPromo({ code: promo.code, percent: promo.percent });
        setPromoError('');
    };

    const handlePromoInputChange = (value: string) => {
        setPromoInput(value);
        if (promoError) {
            setPromoError('');
        }
    };

    const stepTitles: Record<BookingStep, string> = {
        1: br.stepPaymentTiming,
        2: br.stepPaymentMethod,
        3: br.stepHostMessage,
        4: br.stepReview,
    };

    const goToProperty = () => navigate(propertyUrl);

    const openDatesModal = () => {
        setDraftCheckIn(checkIn);
        setDraftCheckOut(checkOut);
        setActiveEditModal('dates');
    };

    const openGuestsModal = () => {
        setDraftGuests(guests);
        setActiveEditModal('guests');
    };

    const closeEditModal = () => setActiveEditModal(null);

    const saveDates = () => {
        if (!draftCheckIn || !draftCheckOut || !property) return;
        if (rangeIncludesBookedDate(property.bookedDates, draftCheckIn, draftCheckOut)) return;
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

    const handleNext = () => {
        setError('');

        if (currentStep === 2 && !useSavedCard && !isValidCard(cardNumber, cardExpiry, cardCvv)) {
            setError(br.errorCard);
            return;
        }

        if (currentStep < STEP_COUNT) {
            setCurrentStep((step) => (step + 1) as BookingStep);
        }
    };

    const handleSubmit = async () => {
        setError('');
        const token = getAuthToken();

        if (!token) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }

        setIsSubmitting(true);

        try {
            await createBooking(token, {
                propertyId: property.id,
                checkIn: toISODate(checkIn),
                checkOut: toISODate(checkOut),
                adults: guests.adults,
                children: guests.children,
                infants: guests.infants,
                pets: guests.pets,
                totalPrice: finalTotal,
                hostMessage: hostMessage.trim() || undefined,
                paymentTiming,
                propertyTitle: property.title,
                propertyImageUrl: property.imageUrl,
                propertyLocation: property.city
                    ? `${property.city}, ${dictionary.common.russia}`
                    : property.location,
                propertyType: property.propertyType,
                hostName: property.host.name,
                pricePerNight: property.pricePerNight,
                subtotal: breakdown.subtotal - breakdown.weeklyDiscount,
                taxes: breakdown.taxes,
            });

            addLoyaltyPoints(BOOKING_LOYALTY_REWARD);
            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : dictionary.property.errorBookingFailed);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewTrips = () => {
        localStorage.setItem('profileActiveTab', 'trips');
        navigate('/profile');
    };

        if (isSuccess) {
        return (
            <PageLayout className={styles.bookingPage}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✓</div>
                    <h1 className={styles.successTitle}>{br.successTitle}</h1>
                    <p className={styles.successText}>{br.successText}</p>
                    <div className={styles.successActions}>
                        <Button type="button" onClick={handleViewTrips}>{dictionary.booking.viewTrips}</Button>
                        <button type="button" className={styles.textBtn} onClick={goToProperty}>
                            {dictionary.booking.close}
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const renderStepContent = (step: BookingStep) => {
        if (step === 1) {
            return (
                <div className={styles.stepBody}>
                    <label className={`${styles.radioOption} ${paymentTiming === 'now' ? styles.radioOptionActive : ''}`}>
                        <input
                            type="radio"
                            name="paymentTiming"
                            checked={paymentTiming === 'now'}
                            onChange={() => setPaymentTiming('now')}
                        />
                        <div>
                            <p className={styles.optionTitle}>
                                {br.payNow.replace('{amount}', totalFormatted)}
                            </p>
                            <p className={styles.optionHint}>{br.payNowHint}</p>
                        </div>
                    </label>

                    <label className={`${styles.radioOption} ${paymentTiming === 'later' ? styles.radioOptionActive : ''}`}>
                        <input
                            type="radio"
                            name="paymentTiming"
                            checked={paymentTiming === 'later'}
                            onChange={() => setPaymentTiming('later')}
                        />
                        <div>
                            <p className={styles.optionTitle}>{br.payLater}</p>
                            <p className={styles.optionHint}>
                                {br.payLaterHint
                                    .replace('{amount}', totalFormatted)
                                    .replace('{date}', payLaterDate)}
                            </p>
                        </div>
                    </label>

                    <div className={styles.stepActions}>
                        <Button type="button" onClick={handleNext}>{br.next}</Button>
                    </div>
                </div>
            );
        }

        if (step === 2) {
            const savedCardLabel = savedCard
                ? br.savedCardLabel
                    .replace('{brand}', savedCard.brand)
                    .replace('{last4}', savedCard.last4)
                : '';

            return (
                <div className={styles.stepBody}>
                    {savedCard && (
                        <div className={styles.savedCardOptions}>
                            <label className={`${styles.radioOption} ${useSavedCard ? styles.radioOptionActive : ''}`}>
                                <input
                                    type="radio"
                                    name="cardSource"
                                    checked={useSavedCard}
                                    onChange={() => {
                                        setUseSavedCard(true);
                                        setError('');
                                    }}
                                />
                                <div>
                                    <p className={styles.optionTitle}>{br.useSavedCard}</p>
                                    <p className={styles.optionHint}>{savedCardLabel}</p>
                                </div>
                            </label>

                            <label className={`${styles.radioOption} ${!useSavedCard ? styles.radioOptionActive : ''}`}>
                                <input
                                    type="radio"
                                    name="cardSource"
                                    checked={!useSavedCard}
                                    onChange={() => {
                                        setUseSavedCard(false);
                                        setError('');
                                    }}
                                />
                                <div>
                                    <p className={styles.optionTitle}>{br.enterNewCard}</p>
                                </div>
                            </label>
                        </div>
                    )}

                    {!useSavedCard && (
                        <div className={styles.formGrid}>
                            <div className={styles.fullWidth}>
                                <label className={styles.fieldLabel} htmlFor="booking-card-number">{br.cardNumber}</label>
                                <Input
                                    id="booking-card-number"
                                    value={cardNumber}
                                    placeholder={br.cardNumberPlaceholder}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className={styles.fieldLabel} htmlFor="booking-card-expiry">{br.cardExpiry}</label>
                                <Input
                                    id="booking-card-expiry"
                                    value={cardExpiry}
                                    placeholder={br.cardExpiryPlaceholder}
                                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className={styles.fieldLabel} htmlFor="booking-card-cvv">{br.cardCvv}</label>
                                <Input
                                    id="booking-card-cvv"
                                    value={cardCvv}
                                    placeholder={br.cardCvvPlaceholder}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <label className={styles.fieldLabel} htmlFor="booking-card-postal">{br.cardPostal}</label>
                                <Input
                                    id="booking-card-postal"
                                    value={cardPostal}
                                    placeholder={br.cardPostalPlaceholder}
                                    onChange={(e) => setCardPostal(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.stepActions}>
                        <Button type="button" onClick={handleNext}>{br.next}</Button>
                    </div>
                </div>
            );
        }

        if (step === 3) {
            return (
                <div className={styles.stepBody}>
                    <label className={styles.fieldLabel} htmlFor="booking-host-message">{br.reviewMessage}</label>
                    <textarea
                        id="booking-host-message"
                        className={styles.messageArea}
                        value={hostMessage}
                        placeholder={br.hostMessagePlaceholder}
                        rows={6}
                        onChange={(e) => setHostMessage(e.target.value)}
                    />
                    <p className={styles.messageHint}>{br.hostMessageHint}</p>
                    <div className={styles.stepActions}>
                        <Button type="button" onClick={handleNext}>{br.next}</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.stepBody}>
                <div className={styles.reviewBlock}>
                    <p className={styles.reviewLabel}>{br.reviewPayment}</p>
                    <p className={styles.reviewValue}>
                        {paymentTiming === 'now' ? br.paymentNow : br.paymentLater}
                        {' · '}
                        {totalFormatted}
                    </p>
                </div>
                <div className={styles.reviewBlock}>
                    <p className={styles.reviewLabel}>{br.reviewMessage}</p>
                    <p className={styles.reviewValue}>
                        {hostMessage.trim() || br.reviewNoMessage}
                    </p>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.stepActions}>
                    <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? br.submitting : br.submit}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <PageLayout className={styles.bookingPage}>
            <div className={styles.layout}>
                <div className={styles.main}>
                        <header className={styles.pageHeader}>
                            <BackButton className={styles.backBtn} onClick={goToProperty}>
                                {br.backToListing}
                            </BackButton>
                            <h1 className={styles.title}>{br.title}</h1>
                        </header>

                        <div className={styles.steps}>
                            {([1, 2, 3, 4] as BookingStep[]).map((step) => {
                                const isActive = step === currentStep;
                                const isCompleted = step < currentStep;

                                return (
                                    <section
                                        key={step}
                                        className={`${styles.stepCard} ${isActive ? styles.stepCardActive : ''} ${isCompleted ? styles.stepCardDone : ''}`}
                                    >
                                        <button
                                            type="button"
                                            className={styles.stepHeader}
                                            onClick={() => {
                                                if (step <= currentStep) {
                                                    setCurrentStep(step);
                                                }
                                            }}
                                            disabled={step > currentStep}
                                        >
                                            <span className={styles.stepNumber}>{step}</span>
                                            <span className={styles.stepTitle}>{stepTitles[step]}</span>
                                            {isCompleted && !isActive && (
                                                <span className={styles.stepCheck}>✓</span>
                                            )}
                                        </button>
                                        {isActive && renderStepContent(step)}
                                    </section>
                                );
                            })}
                        </div>
                    </div>

                    <BookingRequestSidebar
                        property={property}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                        breakdown={breakdown}
                        finalTotal={finalTotal}
                        promoDiscount={promoDiscount}
                        appliedPromo={appliedPromo}
                        promoInput={promoInput}
                        promoError={promoError}
                        onPromoInputChange={handlePromoInputChange}
                        onApplyPromo={handleApplyPromo}
                        onEditDates={openDatesModal}
                        onEditGuests={openGuestsModal}
                    />
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
        </PageLayout>
    );
};
