import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './DatePicker.module.scss';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
    isAfter, isBefore, startOfDay
} from 'date-fns';
import { useTranslation } from '../../../i18n/useTranslation';

import { Tabs } from '../Tabs/Tabs';
import { Pill } from '../Pill/Pill';
import { MonthCard } from '../MonthCard/MonthCard';

interface DatePickerProps {
    isOpen: boolean;
    onClose: () => void;
    startDate: Date | null;
    endDate: Date | null;
    onChange: (dates: { start: Date | null; end: Date | null }) => void;
    flexibility: string;
    onFlexibilityChange: (value: string) => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    flexDuration: string;
    onFlexDurationChange: (duration: string) => void;
    selectedFlexMonths: Date[];
    onFlexMonthsChange: (months: Date[]) => void;
    isDateDisabled?: (date: Date) => boolean;
    placement?: 'search' | 'sidebar' | 'modal';
    anchor?: 'dates' | 'guests';
    layout?: 'paged' | 'scroll';
    weekdays?: string[];
}

const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const DatePicker: React.FC<DatePickerProps> = ({
    isOpen, onClose, startDate, endDate, onChange, flexibility, onFlexibilityChange,
    activeTab, onTabChange, flexDuration, onFlexDurationChange, selectedFlexMonths, onFlexMonthsChange,
    isDateDisabled,
    placement = 'search',
    anchor = 'dates',
    layout = 'paged',
    weekdays,
}) => {
    const { dictionary, dateLocale } = useTranslation();
    const searchLabels = dictionary.search;
    const [leftMonthDate, setLeftMonthDate] = useState(startOfMonth(startDate ?? new Date()));
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const today = startOfDay(new Date());

    useEffect(() => {
        if (!isOpen) return;
        setLeftMonthDate(startOfMonth(startDate ?? new Date()));
        setHoverDate(null);
    }, [isOpen, startDate]);

    useLayoutEffect(() => {
        if (!isOpen || layout !== 'scroll' || placement !== 'modal') return;

        const targetMonth = startOfMonth(startDate ?? today);
        const monthId = `calendar-month-${format(targetMonth, 'yyyy-MM')}`;

        requestAnimationFrame(() => {
            document.getElementById(monthId)?.scrollIntoView({ block: 'start' });
        });
    }, [isOpen, layout, placement, startDate]);

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

    const nextMonth = () => setLeftMonthDate(addMonths(leftMonthDate, 1));
    const prevMonth = () => setLeftMonthDate(subMonths(leftMonthDate, 1));

    const onDateClick = (day: Date) => {
        const dayStart = startOfDay(day);

        if (isDateDisabled?.(dayStart)) {
            return;
        }

        if (!startDate || (startDate && endDate) || isBefore(dayStart, startOfDay(startDate))) {
            onChange({ start: dayStart, end: null });
            return;
        }

        if (!endDate && isAfter(dayStart, startOfDay(startDate))) {
            let cursor = addDays(startOfDay(startDate), 1);

            while (!isAfter(cursor, dayStart)) {
                if (isDateDisabled?.(cursor)) {
                    return;
                }
                cursor = addDays(cursor, 1);
            }

            onChange({ start: startDate, end: dayStart });
        }
    };

    const generateNext12Months = () => {
        return Array.from({ length: 12 }).map((_, i) => addMonths(startOfMonth(today), i));
    };

    const toggleFlexMonth = (month: Date) => {
        const exists = selectedFlexMonths.some(m => isSameMonth(m, month));
        if (exists) {
            onFlexMonthsChange(selectedFlexMonths.filter(m => !isSameMonth(m, month)));
        } else {
            onFlexMonthsChange([...selectedFlexMonths, month]);
        }
    };

    const renderCalendarView = () => {
        const weekdayLabels = weekdays ?? searchLabels.weekdays;
        const showBookedStyle = Boolean(isDateDisabled) && (layout === 'scroll' || placement === 'modal');

        const renderMonth = (monthDate: Date, isLeft: boolean, scrollMode = false) => {
            const monthStart = startOfMonth(monthDate);
            const monthEnd = endOfMonth(monthStart);
            const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
            const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

            const rows = [];
            let days = [];
            let day = startDateGrid;

            while (day <= endDateGrid) {
                for (let i = 0; i < 7; i++) {
                    const cloneDay = startOfDay(day);
                    const isPast = isBefore(cloneDay, today);
                    const isBlocked = isDateDisabled?.(cloneDay) ?? false;
                    const isBooked = isBlocked && !isPast;
                    const isUnavailable = isPast || isBlocked;
                    const isStart = startDate && isSameDay(cloneDay, startOfDay(startDate));
                    const isEnd = endDate && isSameDay(cloneDay, startOfDay(endDate));
                    const isHoverEnd = !endDate && startDate && hoverDate
                        && isAfter(startOfDay(hoverDate), startOfDay(startDate))
                        && isSameDay(cloneDay, startOfDay(hoverDate));

                    let isPartOfRange = false;
                    const rangeEnd = endDate ?? (hoverDate && startDate && isAfter(hoverDate, startDate) ? hoverDate : null);

                    if (startDate && rangeEnd && !isSameDay(startOfDay(startDate), startOfDay(rangeEnd))) {
                        isPartOfRange = !isBefore(cloneDay, startOfDay(startDate))
                            && !isAfter(cloneDay, startOfDay(rangeEnd))
                            && !isBlocked;
                    }

                    if (isBooked) {
                        isPartOfRange = false;
                    }

                    const cellClasses = [styles.cellWrapper];
                    if (isPartOfRange && isStart) cellClasses.push(styles.rangeStart);
                    if (isPartOfRange && (isEnd || isHoverEnd)) cellClasses.push(styles.rangeEnd);

                    const dayClasses = [styles.day];
                    if (!isSameMonth(cloneDay, monthStart)) dayClasses.push(styles.outsideMonth);
                    if (isPast) dayClasses.push(styles.disabled);
                    if (isBooked && showBookedStyle) dayClasses.push(styles.booked);
                    if (isStart || isEnd || isHoverEnd) dayClasses.push(styles.selected);

                    days.push(
                        <div key={cloneDay.toString()} className={cellClasses.join(' ')} onMouseEnter={() => !isUnavailable && startDate && !endDate && setHoverDate(cloneDay)}>
                            {isPartOfRange && <div className={styles.inRangeBg}></div>}
                            <div
                                className={dayClasses.join(' ')}
                                onClick={() => !isUnavailable && onDateClick(cloneDay)}
                                aria-disabled={isUnavailable}
                            >
                                {isSameMonth(cloneDay, monthStart) ? format(cloneDay, "d") : ''}
                            </div>
                        </div>
                    );
                    day = addDays(day, 1);
                }
                rows.push(<div className={styles.grid} key={day.toString()}>{days}</div>);
                days = [];
            }

            return (
                <div
                    id={scrollMode ? `calendar-month-${format(monthDate, 'yyyy-MM')}` : undefined}
                    className={styles.month}
                >
                    <div className={`${styles.monthHeader} ${scrollMode ? styles.monthHeaderScroll : ''}`}>
                        {scrollMode ? (
                            <span className={styles.monthTitleScroll}>
                                {format(monthDate, 'LLLL yyyy', { locale: dateLocale })}
                            </span>
                        ) : isLeft ? (
                            <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
                                <ChevronLeft />
                            </button>
                        ) : (
                            <span className={styles.navSpacer} aria-hidden />
                        )}
                        {!scrollMode && (
                            <>
                                <span className={styles.monthTitle}>{format(monthDate, 'LLLL yyyy', { locale: dateLocale })}</span>
                                {!isLeft ? (
                                    <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
                                        <ChevronRight />
                                    </button>
                                ) : (
                                    <span className={styles.navSpacer} aria-hidden />
                                )}
                            </>
                        )}
                    </div>
                    <div className={styles.daysRow}>
                        {weekdayLabels.map((d, i) => <div key={i}>{d}</div>)}
                    </div>
                    {rows}
                </div>
            );
        };

        if (layout === 'scroll') {
            const months = Array.from({ length: 14 }, (_, index) => addMonths(startOfMonth(today), index));

            return (
                <div className={`${styles.monthsContainer} ${styles.monthsContainerModal} ${styles.monthsContainerScroll}`}>
                    {months.map((monthDate) => renderMonth(monthDate, true, true))}
                </div>
            );
        }

        const flexibilityOptions = [
            { label: searchLabels.dateExact, value: 'exact' },
            { label: searchLabels.dateFlex1Day, value: '1day' },
            { label: searchLabels.dateFlex2Days, value: '2days' },
            { label: searchLabels.dateFlex3Days, value: '3days' },
            { label: searchLabels.dateFlex7Days, value: '7days' },
        ];

        return (
            <>
                <div className={`${styles.monthsContainer} ${placement === 'modal' ? styles.monthsContainerModal : ''}`}>
                    {renderMonth(leftMonthDate, true)}
                    {renderMonth(addMonths(leftMonthDate, 1), false)}
                </div>
                {placement !== 'modal' && (
                    <div className={styles.footerOptionsWrapper}>
                        {flexibilityOptions.map(option => (
                            <Pill
                                key={option.value} label={option.label}
                                isActive={flexibility === option.value}
                                onClick={() => onFlexibilityChange(option.value)}
                            />
                        ))}
                    </div>
                )}
            </>
        );
    };

    const renderFlexibleView = () => {
        const durations = [
            { id: 'weekend', label: searchLabels.dateWeekend },
            { id: 'week', label: searchLabels.dateWeek },
            { id: 'month', label: searchLabels.dateMonth },
        ];

        const upcomingMonths = generateNext12Months();

        return (
            <div className={styles.flexibleContainer}>
                <div className={styles.flexSection}>
                    <div className={styles.flexTitle}>{searchLabels.flexStayTitle}</div>
                    <div className={styles.durationWrapper}>
                        {durations.map(dur => (
                            <Pill
                                key={dur.id}
                                label={dur.label}
                                isActive={flexDuration === dur.id}
                                onClick={() => onFlexDurationChange(dur.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.flexSection}>
                    <div className={styles.flexTitle}>{searchLabels.flexWhenTitle}</div>
                    <div className={styles.monthsSlider}>
                        {upcomingMonths.map((monthDate) => (
                            <MonthCard
                                key={monthDate.toString()}
                                month={format(monthDate, 'LLL', { locale: dateLocale })}
                                year={format(monthDate, 'yyyy')}
                                isActive={selectedFlexMonths.some(m => isSameMonth(m, monthDate))}
                                onClick={() => toggleFlexMonth(monthDate)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (placement === 'modal') {
        return (
            <div
                className={`${styles.modalContent} ${layout === 'scroll' ? styles.modalContentScroll : ''}`}
                ref={wrapperRef}
            >
                {renderCalendarView()}
            </div>
        );
    }

    return (
        <div
            className={`${styles.wrapper} ${anchor === 'guests' ? styles.wrapperGuests : styles.wrapperDates}`}
            ref={wrapperRef}
        >
            <div className={`${styles.dropdown} ${placement === 'sidebar' ? styles.dropdownSidebar : ''}`}>
                <div style={{ marginBottom: placement === 'sidebar' ? '16px' : '24px' }}>
                    {placement === 'search' && (
                        <Tabs
                            options={[
                                { label: searchLabels.tabDates, value: 'dates' },
                                { label: searchLabels.tabFlexible, value: 'flexible' },
                            ]}
                            activeValue={activeTab}
                            onChange={onTabChange}
                        />
                    )}
                </div>

                {(placement === 'sidebar' || activeTab === 'dates') ? renderCalendarView() : renderFlexibleView()}

            </div>
        </div>
    );
};