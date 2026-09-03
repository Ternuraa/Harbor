import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './BookingPage.module.scss';

// Контексты и утилиты
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';
import { getAuthToken } from '../../utils/authStorage';
import { createBooking } from '../../utils/bookingsApi';
import { calculateNights, calculateTotalPrice, formatGuestsLabel, toISODate } from '../../utils/searchParams';
import { isPropertyBookedOnDate } from '../../utils/propertyBookings';
import { usePropertyFromDb } from '../../utils/loadProperties';

// Компоненты
import { Button } from '../../components/Button/Button';
import { DatePicker } from '../../components/ui/DatePicker/DatePicker';
import { GuestPicker } from '../../components/ui/GuestPicker/GuestPicker';

export const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated } = useAuth();
    const { checkIn, checkOut, guests, setDates, setGuests } = useSearch();

    // Стейты UI
    const [activeStep, setActiveStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('full');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const numericId = Number(id);
    const property = usePropertyFromDb(Number.isFinite(numericId) ? numericId : -1);

    const isDateDisabled = useCallback(
        (date: Date) => property ? isPropertyBookedOnDate(property.bookedDates, date) : false,
        [property]
    );

    if (!property) return <div style={{ padding: '120px', textAlign: 'center' }}>Жилье не найдено</div>;

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = calculateTotalPrice(property.pricePerNight, checkIn, checkOut);

    // Вычисляем налоги и сборы
    const tax = Math.round(totalPrice * 0.1);
    const grandTotal = totalPrice + tax;

    const formattedDates = checkIn && checkOut
        ? `${checkIn.getDate()}–${checkOut.getDate()} ${checkIn.toLocaleString('ru', { month: 'short' })}. ${checkIn.getFullYear()} г.`
        : 'Даты не выбраны';

    const guestsLabel = formatGuestsLabel(guests, 'ru');

    // Главная функция бронирования
    const handleConfirmBooking = async () => {
        if (!checkIn || !checkOut) {
            setError('Пожалуйста, выберите даты поездки.');
            return;
        }

        if (!isAuthenticated) {
            const redirect = encodeURIComponent(location.pathname + location.search);
            navigate(`/login?redirect=${redirect}`);
            return;
        }

        const token = getAuthToken();
        if (!token) return;

        setIsSubmitting(true);
        setError('');

        try {
            // Отправляем запрос на создание брони
            await createBooking(token, {
                propertyId: property.id,
                checkIn: toISODate(checkIn),
                checkOut: toISODate(checkOut),
                adults: guests.adults,
                children: guests.children,
                infants: guests.infants,
                pets: guests.pets,
                totalPrice: grandTotal,
            });

            // Успех! Перекидываем в профиль на вкладку поездок
            localStorage.setItem('profileActiveTab', 'trips');
            navigate('/profile');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при бронировании. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className={styles.pageTitle}>Запрос на бронирование</h1>
            </div>

            <div className={styles.contentGrid}>
                {/* ЛЕВАЯ КОЛОНКА (ШАГИ И КАРТА) */}
                <div className={styles.stepsColumn}>

                    {/* ШАГ 1 */}
                    <div className={`${styles.stepBlock} ${activeStep === 1 ? styles.active : ''}`}>
                        <h2 className={styles.stepTitle}>1. Выберите время платежа</h2>
                        {activeStep === 1 && (
                            <div className={styles.stepBody}>
                                <label className={`${styles.radioOption} ${paymentMethod === 'full' ? styles.selected : ''}`}>
                                    <div className={styles.radioInfo}>
                                        <div className={styles.radioTitle}>Заплатите {grandTotal.toLocaleString('ru-RU')} ₽ сейчас</div>
                                        {/* Отображаем информацию о налогах в зависимости от наличия комиссии объекта */}
                                        {property.noCommission ? (
                                            <div className={styles.taxNoteBlock}>✓ Все налоги и сборы уже включены в стоимость</div>
                                        ) : (
                                            <div className={styles.taxNoteBlock}>Включает налоги и сборы: {tax.toLocaleString('ru-RU')} ₽</div>
                                        )}
                                    </div>
                                    <input type="radio" checked={paymentMethod === 'full'} onChange={() => setPaymentMethod('full')} />
                                </label>

                                <label className={`${styles.radioOption} ${paymentMethod === 'split' ? styles.selected : ''}`}>
                                    <div className={styles.radioInfo}>
                                        <div className={styles.radioTitle}>Заплатите 0 ₽ сейчас</div>
                                        <div className={styles.radioSubtitle}>Деньги спишутся за 3 дня до прибытия. Дополнительных сборов нет.</div>
                                    </div>
                                    <input type="radio" checked={paymentMethod === 'split'} onChange={() => setPaymentMethod('split')} />
                                </label>

                                <div className={styles.nextBtnWrapper}>
                                    <Button onClick={() => setActiveStep(2)}>Далее</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ШАГ 2 (ОПЛАТА И БРОНЬ) */}
                    <div className={`${styles.stepBlock} ${activeStep === 2 ? styles.active : ''}`}>
                        <h2 className={styles.stepTitle}>2. Оплата и подтверждение</h2>
                        {activeStep === 2 && (
                            <div className={styles.stepBody}>
                                <div className={styles.paymentMockup}>
                                    <p>💳 Оплата картой (демо-режим)</p>
                                    <span className={styles.secureText}>Ваши данные защищены</span>
                                </div>

                                {error && <p className={styles.errorText}>{error}</p>}

                                <div className={styles.nextBtnWrapper}>
                                    <Button onClick={handleConfirmBooking} disabled={isSubmitting || !checkIn}>
                                        {isSubmitting ? 'Бронируем...' : 'Подтвердить и забронировать'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* ПРАВАЯ КОЛОНКА (СВОДКА С ПИКЕРАМИ) */}
                <div className={styles.summaryColumn}>
                    <div className={styles.summaryCard}>

                        <div className={styles.propertyPreview}>
                            <img src={property.imageUrl} alt={property.title} />
                            <div className={styles.propInfo}>
                                <div className={styles.propTitle}>{property.title}</div>
                                <div className={styles.propRating}>★ {property.rating} ({property.reviewsCount} отзывов)</div>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* БЛОК ДАТ С ВЫПАДАЮЩИМ КАЛЕНДАРЕМ */}
                        <div className={styles.summarySection}>
                            <div className={styles.sectionHeader}>
                                <h3>Даты</h3>
                                <div className={styles.pickerAnchor}>
                                    <button className={styles.editBtn} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                                        Изменить
                                    </button>
                                    <DatePicker
                                        isOpen={isDatePickerOpen}
                                        onClose={() => setIsDatePickerOpen(false)}
                                        startDate={checkIn}
                                        endDate={checkOut}
                                        onChange={setDates}
                                        isDateDisabled={isDateDisabled} // 🛑 Заблокированные даты передаются сюда
                                        placement="modal"
                                        flexibility="exact"
                                        onFlexibilityChange={() => { }}
                                        activeTab="dates"
                                        onTabChange={() => { }}
                                        flexDuration="weekend"
                                        onFlexDurationChange={() => { }}
                                        selectedFlexMonths={[]}
                                        onFlexMonthsChange={() => { }}
                                    />
                                </div>
                            </div>
                            <div className={styles.sectionValue}>{formattedDates}</div>
                        </div>

                        {/* БЛОК ГОСТЕЙ С ВЫПАДАЮЩИМ ПИКЕРОМ */}
                        <div className={styles.summarySection}>
                            <div className={styles.sectionHeader}>
                                <h3>Гости</h3>
                                <div className={styles.pickerAnchor}>
                                    <button className={styles.editBtn} onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}>
                                        Изменить
                                    </button>
                                    <GuestPicker
                                        isOpen={isGuestPickerOpen}
                                        onClose={() => setIsGuestPickerOpen(false)}
                                        guests={guests}
                                        onChange={setGuests}
                                        placement="sidebar"
                                    />
                                </div>
                            </div>
                            <div className={styles.sectionValue}>{guestsLabel}</div>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.priceBreakdown}>
                            <h3>Информация о цене</h3>
                            <div className={styles.priceRow}>
                                <span>{property.pricePerNight.toLocaleString('ru-RU')} ₽ × {nights || 0} ночей</span>
                                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className={styles.priceRow}>
                                <span>Налоги и сборы</span>
                                <span>{tax.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Итого (RUB)</span>
                                <span>{grandTotal.toLocaleString('ru-RU')} ₽</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};