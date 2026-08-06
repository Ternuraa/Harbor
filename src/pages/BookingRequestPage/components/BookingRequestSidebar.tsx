import React, { useState } from 'react';
import { formatDatesRange, formatGuestsLabel } from '../../../utils/searchParams';
import { formatMoney } from '../../../utils/bookingPricing';
import { formatPerNight, getLocaleForNumber, getNightLabel } from '../../../utils/localizeProperty';
import type { AppliedPromo } from '../../../utils/paymentsStorage';
import type { BookingPriceBreakdown } from '../../../utils/bookingPricing';
import type { Property } from '../../../types/property';
import type { GuestsState } from '../../../components/ui/GuestPicker/GuestPicker';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { ResponsiveImage } from '../../../components/ui/ResponsiveImage/ResponsiveImage';
import { InfoArticleContent } from '../../../components/ui/InfoArticleContent/InfoArticleContent';
import { BookingEditModal } from './BookingEditModal';
import { useTranslation } from '../../../i18n/useTranslation';
import styles from './BookingRequestSidebar.module.scss';

interface BookingRequestSidebarProps {
    property: Property;
    checkIn: Date;
    checkOut: Date;
    guests: GuestsState;
    breakdown: BookingPriceBreakdown;
    finalTotal: number;
    promoDiscount: number;
    appliedPromo: AppliedPromo | null;
    promoInput: string;
    promoError: string;
    onPromoInputChange: (value: string) => void;
    onApplyPromo: () => void;
    onEditDates: () => void;
    onEditGuests: () => void;
}

export const BookingRequestSidebar: React.FC<BookingRequestSidebarProps> = ({
    property,
    checkIn,
    checkOut,
    guests,
    breakdown,
    finalTotal,
    promoDiscount,
    appliedPromo,
    promoInput,
    promoError,
    onPromoInputChange,
    onApplyPromo,
    onEditDates,
    onEditGuests,
}) => {
    const { language, dictionary, tPage } = useTranslation();
    const br = dictionary.bookingRequest;
    const cancellationPolicy = tPage('cancellationPolicy');
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const locale = getLocaleForNumber(language);
    const nightLabel = getNightLabel(breakdown.nights, language);
    const formattedRating = language === 'en'
        ? property.rating.toString()
        : property.rating.toString().replace('.', ',');

    const handlePromoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onApplyPromo();
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.card}>
                <div className={styles.propertyPreview}>
                    <ResponsiveImage src={property.imageUrl} alt={property.title} className={styles.previewImage} />
                    <div className={styles.previewInfo}>
                        <p className={styles.previewTitle}>{property.title}</p>
                        <div className={styles.previewMeta}>
                            <span className={styles.rating}>★ {formattedRating}</span>
                            <span>({property.reviewsCount.toLocaleString(locale)})</span>
                        </div>
                        <span className={styles.guestChoice}>{br.guestChoice}</span>
                    </div>
                </div>

                <div className={styles.cancellation}>
                    <p className={styles.cancellationTitle}>{br.freeCancellation}</p>
                    <p className={styles.cancellationText}>
                        {br.freeCancellationHint}{' '}
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setIsRulesOpen(true)}
                        >
                            {br.fullRules}
                        </button>
                    </p>
                </div>

                <div className={styles.divider} />

                <div className={styles.detailRow}>
                    <div>
                        <p className={styles.detailLabel}>{br.dates}</p>
                        <p className={styles.detailValue}>{formatDatesRange(checkIn, checkOut, language)}</p>
                    </div>
                    <button type="button" className={styles.changeBtn} onClick={onEditDates}>
                        {br.change}
                    </button>
                </div>

                <div className={styles.detailRow}>
                    <div>
                        <p className={styles.detailLabel}>{br.guestsLabel}</p>
                        <p className={styles.detailValue}>{formatGuestsLabel(guests, language)}</p>
                    </div>
                    <button type="button" className={styles.changeBtn} onClick={onEditGuests}>
                        {br.change}
                    </button>
                </div>

                <div className={styles.divider} />

                <label className={styles.priceTitle} htmlFor="booking-promo">{br.promoCode}</label>
                <div className={styles.promoSection}>
                    <Input
                        id="booking-promo"
                        value={promoInput}
                        placeholder={br.promoPlaceholder}
                        onChange={(e) => onPromoInputChange(e.target.value)}
                        onKeyDown={handlePromoKeyDown}
                    />
                    <Button type="button" onClick={onApplyPromo}>{br.applyPromo}</Button>
                    {promoError && <p className={styles.promoError}>{promoError}</p>}
                    {appliedPromo && !promoError && (
                        <p className={styles.promoSuccess}>
                            {br.promoApplied.replace('{percent}', String(appliedPromo.percent))}
                        </p>
                    )}
                </div>

                <div className={styles.divider} />

                <p className={styles.priceTitle}>{br.priceDetails}</p>

                <div className={styles.priceRow}>
                    <span>
                        {br.nightsLine
                            .replace('{nights}', String(breakdown.nights))
                            .replace('{nightLabel}', nightLabel)
                            .replace('{price}', formatPerNight(property.pricePerNight, language))}
                    </span>
                    <span>{formatMoney(breakdown.subtotal, locale)}</span>
                </div>

                {breakdown.weeklyDiscount > 0 && (
                    <div className={`${styles.priceRow} ${styles.discountRow}`}>
                        <span>{br.weeklyDiscount}</span>
                        <span>−{formatMoney(breakdown.weeklyDiscount, locale)}</span>
                    </div>
                )}

                {breakdown.taxesIncluded ? (
                    <p className={styles.includedNote}>{br.taxesIncludedNote}</p>
                ) : (
                    <div className={styles.priceRow}>
                        <span>{br.taxes}</span>
                        <span>{formatMoney(breakdown.taxes, locale)}</span>
                    </div>
                )}

                {promoDiscount > 0 && appliedPromo && (
                    <div className={`${styles.priceRow} ${styles.discountRow}`}>
                        <span>{br.promoDiscount} ({appliedPromo.code})</span>
                        <span>−{formatMoney(promoDiscount, locale)}</span>
                    </div>
                )}

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                    <span>{br.totalRub}</span>
                    <span>{formatMoney(finalTotal, locale)}</span>
                </div>
            </div>

            {cancellationPolicy && (
                <BookingEditModal
                    isOpen={isRulesOpen}
                    title={cancellationPolicy.title}
                    onClose={() => setIsRulesOpen(false)}
                    saveLabel={br.rulesGotIt}
                    cancelLabel={br.cancel}
                    mode="info"
                >
                    <InfoArticleContent content={cancellationPolicy} variant="modal" />
                </BookingEditModal>
            )}
        </aside>
    );
};
