import React, { useRef, useEffect } from 'react';
import styles from './GuestPicker.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';
import { Stepper } from '../Stepper/Stepper';

export interface GuestsState {
    adults: number;
    children: number;
    infants: number;
    pets: number;
}

interface GuestPickerProps {
    isOpen: boolean;
    onClose: () => void;
    guests: GuestsState;
    onChange: (guests: GuestsState) => void;
    placement?: 'search' | 'sidebar' | 'modal';
    anchor?: 'dates' | 'guests';
}

export const GuestPicker: React.FC<GuestPickerProps> = ({
    isOpen, onClose, guests, onChange, placement = 'search', anchor = 'guests',
}) => {
    const { dictionary } = useTranslation();
    const labels = dictionary.search;
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (placement === 'modal') return;

        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, placement]);

    if (!isOpen) return null;

    const handleUpdate = (field: keyof GuestsState, value: number) => {
        const newGuests = { ...guests, [field]: value };

        // Автоматически добавляем 1 взрослого, если добавляют ребенка/младенца/питомца, а взрослых 0
        if (field !== 'adults' && value > 0 && guests.adults === 0) {
            newGuests.adults = 1;
        }

        onChange(newGuests);
    };

    // --- НОВАЯ ЛОГИКА ЗАЩИТЫ ОТ ОШИБОК ---
    // Проверяем, есть ли зависимые гости (дети, младенцы или питомцы)
    const hasDependents = guests.children > 0 || guests.infants > 0 || guests.pets > 0;

    // Если зависимые гости есть, минимум взрослых = 1, иначе = 0
    const minAdults = hasDependents ? 1 : 0;

    const guestRows = (
        <>
            <div className={styles.row}>
                <div className={styles.textBlock}>
                    <div className={styles.title}>{labels.guestAdults}</div>
                    <div className={styles.subtitle}>{labels.guestAdultsHint}</div>
                </div>
                <Stepper
                    value={guests.adults}
                    onChange={(v) => handleUpdate('adults', v)}
                    min={minAdults}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.textBlock}>
                    <div className={styles.title}>{labels.guestChildren}</div>
                    <div className={styles.subtitle}>{labels.guestChildrenHint}</div>
                </div>
                <Stepper value={guests.children} onChange={(v) => handleUpdate('children', v)} min={0} />
            </div>

            <div className={styles.row}>
                <div className={styles.textBlock}>
                    <div className={styles.title}>{labels.guestInfants}</div>
                    <div className={styles.subtitle}>{labels.guestInfantsHint}</div>
                </div>
                <Stepper value={guests.infants} onChange={(v) => handleUpdate('infants', v)} min={0} />
            </div>

            <div className={styles.row}>
                <div className={styles.textBlock}>
                    <div className={styles.title}>{labels.guestPets}</div>
                    <div className={styles.subtitle}>{labels.guestPetsHint}</div>
                </div>
                <Stepper value={guests.pets} onChange={(v) => handleUpdate('pets', v)} min={0} max={5} />
            </div>
        </>
    );

    if (placement === 'modal') {
        return (
            <div className={styles.modalContent} ref={wrapperRef}>
                {guestRows}
            </div>
        );
    }

    return (
        <div
            className={`${styles.wrapper} ${anchor === 'guests' ? styles.wrapperGuests : styles.wrapperDates}`}
            ref={wrapperRef}
        >
            <div className={`${styles.dropdown} ${placement === 'sidebar' ? styles.dropdownSidebar : ''}`}>
                {guestRows}
            </div>
        </div>
    );
};