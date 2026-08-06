import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookingConfirmModal.module.scss';
import { Button } from '../Button/Button';
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage';
import { formatDatesRange, calculateNights } from '../../../utils/searchParams';
import type { Booking } from '../../../types/search';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatPerNight, getLocaleForNumber, getNightLabel } from '../../../utils/localizeProperty';

interface BookingConfirmModalProps {
    isOpen: boolean;
    booking: Booking | null;
    propertyTitle: string;
    propertyImageUrl: string;
    propertyLocation: string;
    pricePerNight: number;
    onClose: () => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
    isOpen,
    booking,
    propertyTitle,
    propertyImageUrl,
    propertyLocation,
    pricePerNight,
    onClose,
}) => {
    const navigate = useNavigate();
    const { t, language } = useTranslation();
    const locale = getLocaleForNumber(language);

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

    const nights = useMemo(() => {
        if (!booking) return 0;
        const checkIn = new Date(`${booking.checkIn}T00:00:00`);
        const checkOut = new Date(`${booking.checkOut}T00:00:00`);
        return calculateNights(checkIn, checkOut);
    }, [booking]);

    if (!isOpen || !booking) return null;

    const checkIn = new Date(`${booking.checkIn}T00:00:00`);
    const checkOut = new Date(`${booking.checkOut}T00:00:00`);
    const guestsCount = booking.adults + booking.children + booking.infants;
    const nightLabel = getNightLabel(nights, language);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
            <div className={styles.modal} role="dialog" aria-modal="true">
                <button type="button" className={styles.closeBtn} aria-label={t('common.back')} onClick={onClose}>
                    ×
                </button>

                <div className={styles.content}>
                    <h2 className={styles.title}>{t('booking.confirmedTitle')}</h2>
                    <p className={styles.subtitle}>{t('booking.confirmedText')}</p>

                    <div className={styles.preview}>
                        <ResponsiveImage src={propertyImageUrl} alt={propertyTitle} className={styles.previewImage} />
                        <div>
                            <p className={styles.previewTitle}>{propertyTitle}</p>
                            <p className={styles.previewMeta}>{propertyLocation}</p>
                        </div>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.detailRow}>
                            <span>{t('property.checkIn')} / {t('property.checkOut')}</span>
                            <span>{formatDatesRange(checkIn, checkOut)}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>{t('property.guests')}</span>
                            <span>{guestsCount}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>
                                {formatPerNight(pricePerNight, language)} × {nights} {nightLabel}
                            </span>
                            <span>{booking.totalPrice.toLocaleString(locale)} ₽</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>{t('property.totalLabel')}</span>
                            <span>{booking.totalPrice.toLocaleString(locale)} ₽</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button onClick={() => {
                            onClose();
                            navigate('/profile');
                            localStorage.setItem('profileActiveTab', 'trips');
                        }}>
                            {t('booking.viewTrips')}
                        </Button>
                        <button type="button" className={styles.secondaryLink} onClick={onClose}>
                            {t('booking.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
