import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import styles from './MobileSearchFlow.module.scss';
import { DatePicker } from '../../../ui/DatePicker/DatePicker';
import { Stepper } from '../../../ui/Stepper/Stepper';
import { ToggleSwitch } from '../../../ui/ToggleSwitch/ToggleSwitch';
import type { SearchItem } from '../../../ui/Input/Input';
import type { GuestsState } from '../../../ui/GuestPicker/GuestPicker';
import { useSearch } from '../../../../context/SearchContext';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useTranslation } from '../../../../i18n/useTranslation';
import {
    addRecentSearch,
    filterLocalCities,
    mergeSearchResults,
    POPULAR_DESTINATIONS,
} from '../../../../utils/recentSearches';
import {
    buildSearchQueryString,
    formatDatesRange,
    formatGuestsLabel,
    formatMobileSearchSubtitle,
    formatMobileDateField,
} from '../../../../utils/searchParams';
import { isPropertyBookedOnDate } from '../../../../utils/propertyBookings';
import searchIcon from '../../../ui/icons/Search.svg';

type SearchStep = 'location' | 'dates' | 'guests';
type ActiveDateField = 'checkIn' | 'checkOut';

export type MobileSearchStep = SearchStep;

interface MobileSearchFlowProps {
    isOpen: boolean;
    onClose: () => void;
    initialStep?: SearchStep;
    onSummaryChange?: (summary: { location: string; dates: string; guests: string }) => void;
}

const DEFAULT_ADULTS = 2;

const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SearchListIcon = () => (
    <svg className={styles.destinationIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const MobileSearchFlow: React.FC<MobileSearchFlowProps> = ({
    isOpen,
    onClose,
    initialStep = 'location',
    onSummaryChange,
}) => {
    const navigate = useNavigate();
    const { language, t, dictionary } = useTranslation();
    const labels = dictionary.mobileSearch;
    const {
        city,
        checkIn,
        checkOut,
        guests,
        setCity,
        setDates,
        setGuests,
        propertyBookedDates,
    } = useSearch();

    const [step, setStep] = useState<SearchStep>(initialStep);
    const [draftCity, setDraftCity] = useState(city);
    const [draftCheckIn, setDraftCheckIn] = useState<Date | null>(checkIn);
    const [draftCheckOut, setDraftCheckOut] = useState<Date | null>(checkOut);
    const [draftGuests, setDraftGuests] = useState<GuestsState>(() => ({
        ...guests,
        adults: guests.adults > 0 ? guests.adults : DEFAULT_ADULTS,
    }));
    const [activeDateField, setActiveDateField] = useState<ActiveDateField>('checkIn');
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const debouncedSearch = useDebounce(draftCity, 300);

    const [flexibility, setFlexibility] = useState('exact');
    const [activeTab, setActiveTab] = useState('dates');
    const [flexDuration, setFlexDuration] = useState('weekend');
    const [selectedFlexMonths, setSelectedFlexMonths] = useState<Date[]>([]);

    const syncDraftFromContext = useCallback((step: SearchStep) => {
        setDraftCity(city);
        setDraftCheckIn(checkIn);
        setDraftCheckOut(checkOut);
        setDraftGuests({
            ...guests,
            adults: guests.adults > 0 ? guests.adults : DEFAULT_ADULTS,
        });
        setStep(step);
        setActiveDateField(checkIn && !checkOut ? 'checkOut' : 'checkIn');
    }, [city, checkIn, checkOut, guests]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        syncDraftFromContext(initialStep);
    }, [isOpen, initialStep, syncDraftFromContext]);

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

    useEffect(() => {
        const query = debouncedSearch.trim();
        const localMatches = filterLocalCities(query, POPULAR_DESTINATIONS);

        if (!query) {
            setSearchResults([]);
            return;
        }

        const fetchCities = async () => {
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=${language}&format=json`,
                );

                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                const remoteResults: SearchItem[] = data.results
                    ? data.results.map((item: { name: string; country?: string; admin1?: string }) => ({
                          city: item.name,
                          country: [item.admin1, item.country].filter(Boolean).join(', ') || t('common.unknown'),
                      }))
                    : [];

                setSearchResults(mergeSearchResults(localMatches, remoteResults));
            } catch {
                setSearchResults(localMatches.length > 0 ? localMatches : POPULAR_DESTINATIONS);
            }
        };

        if (localMatches.length > 0) {
            setSearchResults(localMatches);
        }

        fetchCities();
    }, [debouncedSearch, language, t]);

    const rememberCity = useCallback((cityName: string, country = t('common.russia')) => {
        addRecentSearch(cityName, country);
    }, [t]);

    const handleSelectCity = (item: SearchItem) => {
        setDraftCity(item.city);
        rememberCity(item.city, item.country);
        setStep('dates');
        setActiveDateField('checkIn');
    };

    const handleDatesChange = (dates: { start: Date | null; end: Date | null }) => {
        setDraftCheckIn(dates.start);
        setDraftCheckOut(dates.end);

        if (dates.start && !dates.end) {
            setActiveDateField('checkOut');
        }
    };

    const handleClearCheckOut = () => {
        setDraftCheckOut(null);
        setActiveDateField('checkOut');
    };

    const handleContinueDates = () => {
        if (!draftCheckIn || !draftCheckOut) return;
        setStep('guests');
    };

    const handleFind = () => {
        const nextCity = draftCity.trim();
        setCity(nextCity);
        setDates({ start: draftCheckIn, end: draftCheckOut });
        setGuests(draftGuests);

        if (nextCity) {
            rememberCity(nextCity);
        }

        const query = buildSearchQueryString({
            city: nextCity,
            checkIn: draftCheckIn,
            checkOut: draftCheckOut,
            guests: draftGuests,
        });

        onClose();
        navigate(query ? `/search?${query}` : '/search');
    };

    const handleBack = () => {
        if (step === 'guests') {
            setStep('dates');
            return;
        }
        if (step === 'dates') {
            setStep('location');
            return;
        }
        onClose();
    };

    const headerTitle = useMemo(() => {
        if (step === 'location') return labels.enterAddress;
        return draftCity.trim() || labels.enterAddress;
    }, [step, draftCity, labels.enterAddress]);

    const headerSubtitle = formatMobileSearchSubtitle(
        draftCheckIn,
        draftCheckOut,
        draftGuests,
        language,
    );

    const displayedDestinations = useMemo(() => {
        const query = draftCity.trim().toLowerCase();
        if (!query) return POPULAR_DESTINATIONS;

        return searchResults.length > 0
            ? searchResults
            : POPULAR_DESTINATIONS.filter(
                (item) =>
                    item.city.toLowerCase().includes(query)
                    || item.country.toLowerCase().includes(query),
            );
    }, [draftCity, searchResults]);

    const checkInLabel = formatMobileDateField(draftCheckIn, language, labels.when);
    const checkOutLabel = formatMobileDateField(draftCheckOut, language, '');

    const hasPets = draftGuests.pets > 0;

    const isDateDisabled = useCallback(
        (date: Date) => (propertyBookedDates ? isPropertyBookedOnDate(propertyBookedDates, date) : false),
        [propertyBookedDates],
    );

    const handleTogglePets = (checked: boolean) => {
        setDraftGuests((current) => ({
            ...current,
            pets: checked ? 1 : 0,
        }));
    };

    const handleUpdateGuests = (field: keyof GuestsState, value: number) => {
        setDraftGuests((current) => {
            const next = { ...current, [field]: value };
            if (field !== 'adults' && value > 0 && current.adults === 0) {
                next.adults = 1;
            }
            return next;
        });
    };

    const hasDependents = draftGuests.children > 0 || draftGuests.infants > 0 || draftGuests.pets > 0;
    const minAdults = hasDependents ? 1 : 1;

    useEffect(() => {
        if (!onSummaryChange) return;

        onSummaryChange({
            location: draftCity.trim() || t('header.where'),
            dates: formatDatesRange(draftCheckIn, draftCheckOut, language),
            guests: formatGuestsLabel(draftGuests, language),
        });
    }, [draftCity, draftCheckIn, draftCheckOut, draftGuests, language, onSummaryChange, t]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} role="dialog" aria-modal="true">
            <div className={styles.header}>
                <button type="button" className={styles.backBtn} aria-label={t('common.back')} onClick={handleBack}>
                    <BackIcon />
                </button>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>{headerTitle}</h1>
                    <p className={styles.subtitle}>{headerSubtitle}</p>
                </div>
            </div>

            {step === 'location' && (
                <div className={`${styles.content} ${styles.contentScrollable}`}>
                    <input
                        type="text"
                        className={styles.locationInput}
                        placeholder={labels.locationPlaceholder}
                        value={draftCity}
                        onChange={(event) => setDraftCity(event.target.value)}
                        autoFocus
                    />

                    <div className={styles.sectionTitle}>{labels.popularDestinations}</div>

                    <div className={styles.destinationList}>
                        {displayedDestinations.map((item) => (
                            <button
                                key={`${item.city}-${item.country}`}
                                type="button"
                                className={styles.destinationItem}
                                onClick={() => handleSelectCity(item)}
                            >
                                <SearchListIcon />
                                <div className={styles.destinationText}>
                                    <div className={styles.destinationCity}>
                                        {item.city}
                                        {item.country ? `, ${item.country}` : ''}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'dates' && (
                <>
                    <div className={styles.content}>
                        <div className={styles.dateFields}>
                            <button
                                type="button"
                                className={`${styles.dateField} ${activeDateField === 'checkIn' ? styles.dateFieldActive : ''}`}
                                onClick={() => setActiveDateField('checkIn')}
                            >
                                <span className={styles.dateFieldLabel}>{labels.checkIn}</span>
                                <span className={`${styles.dateFieldValue} ${!draftCheckIn ? styles.dateFieldPlaceholder : ''}`}>
                                    {checkInLabel}
                                </span>
                            </button>

                            <div className={styles.dateFieldDivider} aria-hidden />

                            <button
                                type="button"
                                className={`${styles.dateField} ${activeDateField === 'checkOut' ? styles.dateFieldActive : ''}`}
                                onClick={() => setActiveDateField('checkOut')}
                            >
                                <span className={styles.dateFieldLabel}>{labels.checkOut}</span>
                                <span className={styles.dateFieldValue}>{checkOutLabel}</span>
                            </button>

                            {draftCheckOut && (
                                <button
                                    type="button"
                                    className={styles.dateFieldClear}
                                    aria-label={labels.clearDates}
                                    onClick={handleClearCheckOut}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className={styles.calendarWrap}>
                            <DatePicker
                                isOpen
                                onClose={() => undefined}
                                startDate={draftCheckIn}
                                endDate={draftCheckOut}
                                onChange={handleDatesChange}
                                flexibility={flexibility}
                                onFlexibilityChange={setFlexibility}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                flexDuration={flexDuration}
                                onFlexDurationChange={setFlexDuration}
                                selectedFlexMonths={selectedFlexMonths}
                                onFlexMonthsChange={setSelectedFlexMonths}
                                placement="modal"
                                layout="scroll"
                                weekdays={labels.weekdaysShort}
                                isDateDisabled={propertyBookedDates ? isDateDisabled : undefined}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.continueBtn}
                            disabled={!draftCheckIn || !draftCheckOut}
                            onClick={handleContinueDates}
                        >
                            {labels.continue}
                        </button>
                    </div>
                </>
            )}

            {step === 'guests' && (
                <>
                    <div className={`${styles.content} ${styles.contentScrollable}`}>
                        <div className={styles.guestRows}>
                            <div className={styles.guestRow}>
                                <div className={styles.guestText}>
                                    <div className={styles.guestTitle}>{t('search.guestAdults')}</div>
                                    <div className={styles.guestHint}>{labels.adultsHint}</div>
                                </div>
                                <Stepper
                                    value={draftGuests.adults}
                                    onChange={(value) => handleUpdateGuests('adults', value)}
                                    min={minAdults}
                                />
                            </div>

                            <div className={styles.guestRow}>
                                <div className={styles.guestText}>
                                    <div className={styles.guestTitle}>{t('search.guestChildren')}</div>
                                    <div className={styles.guestHint}>{labels.childrenHint}</div>
                                </div>
                                <Stepper
                                    value={draftGuests.children}
                                    onChange={(value) => handleUpdateGuests('children', value)}
                                    min={0}
                                />
                            </div>

                            <div className={styles.guestRow}>
                                <div className={styles.guestText}>
                                    <div className={styles.guestTitle}>{labels.withPets}</div>
                                </div>
                                <ToggleSwitch checked={hasPets} onChange={handleTogglePets} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.findBtn} onClick={handleFind}>
                            <img src={searchIcon} alt="" className={styles.findIcon} />
                            {labels.find}
                        </button>
                    </div>
                </>
            )}
        </div>,
        document.body,
    );
};
