import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.scss';
import searchIcon from '../../ui/icons/Search.svg';
import { Input, type SearchItem } from '../../ui/Input/Input';
import { useDebounce } from '../../../hooks/useDebounce';
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import { GuestPicker } from '../../ui/GuestPicker/GuestPicker';
import { useSearch } from '../../../context/SearchContext';
import {
    addRecentSearch,
    filterLocalCities,
    getRecentSearches,
    mergeSearchResults,
    RECOMMENDED_CITIES,
} from '../../../utils/recentSearches';
import { buildSearchQueryString, formatDatesRange, formatDatesRangeCompact, formatGuestsLabel } from '../../../utils/searchParams';
import { useTranslation } from '../../../i18n/useTranslation';
import { useIsMobile } from '../../../hooks/useIsMobile';

export type MobileSearchSegment = 'location' | 'dates' | 'guests';

interface SearchBarProps {
    onSummaryChange?: (summary: { location: string; dates: string; guests: string }) => void;
    mobileCompact?: boolean;
    onMobileSearchOpen?: () => void;
    onMobileSegmentClick?: (segment: MobileSearchSegment) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSummaryChange,
    mobileCompact = false,
    onMobileSearchOpen,
    onMobileSegmentClick,
}) => {
    const navigate = useNavigate();
    const { language, t } = useTranslation();
    const isMobile = useIsMobile();
    const {
        city,
        checkIn,
        checkOut,
        guests,
        setCity,
        setDates,
        setGuests,
    } = useSearch();

    const [searchValue, setSearchValue] = useState(city);
    const debouncedSearch = useDebounce(searchValue, 300);
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [flexibility, setFlexibility] = useState<string>('exact');
    const [activeTab, setActiveTab] = useState<string>('dates');
    const [flexDuration, setFlexDuration] = useState<string>('weekend');
    const [selectedFlexMonths, setSelectedFlexMonths] = useState<Date[]>([]);

    const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

    useEffect(() => {
        setSearchValue(city);
    }, [city]);

    const refreshRecentSearches = useCallback(() => {
        setRecentSearches(getRecentSearches());
    }, []);

    useEffect(() => {
        refreshRecentSearches();
    }, [refreshRecentSearches]);

    const rememberCity = useCallback((cityName: string, country = t('common.russia')) => {
        addRecentSearch(cityName, country);
        refreshRecentSearches();
    }, [refreshRecentSearches, t]);

    useEffect(() => {
        const query = debouncedSearch.trim();
        const localMatches = filterLocalCities(query);

        if (!query) {
            setSearchResults([]);
            return;
        }

        const fetchCities = async () => {
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${language}&format=json`
                );
                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                const remoteResults: SearchItem[] = data.results
                    ? data.results.map((item: { name: string; country?: string }) => ({
                          city: item.name,
                          country: item.country || t('common.unknown'),
                      }))
                    : [];

                setSearchResults(mergeSearchResults(localMatches, remoteResults));
            } catch {
                setSearchResults(localMatches.length > 0 ? localMatches : RECOMMENDED_CITIES);
            }
        };

        if (localMatches.length > 0) {
            setSearchResults(localMatches);
        }

        fetchCities();
    }, [debouncedSearch, language, t]);

    const datesText = isMobile
        ? formatDatesRangeCompact(checkIn, checkOut, language)
        : formatDatesRange(checkIn, checkOut, language);
    const guestsText = formatGuestsLabel(guests, language);
    const wherePlaceholder = t('header.where');

    useEffect(() => {
        if (onSummaryChange) {
            onSummaryChange({
                location: searchValue.trim() ? searchValue : wherePlaceholder,
                dates: datesText,
                guests: guestsText,
            });
        }
    }, [searchValue, datesText, guestsText, onSummaryChange, wherePlaceholder]);

    const handleSearchSubmit = () => {
        const nextCity = searchValue.trim();
        setCity(nextCity);

        if (nextCity) {
            rememberCity(nextCity);
        }

        const query = buildSearchQueryString({
            city: nextCity,
            checkIn,
            checkOut,
            guests,
        });

        navigate(query ? `/search?${query}` : '/search');
    };

    const handleItemSelect = (item: SearchItem) => {
        setSearchValue(item.city);
        setCity(item.city);
        rememberCity(item.city, item.country);
    };

    const openDatePicker = () => {
        setIsGuestPickerOpen(false);
        setIsDatePickerOpen(true);
    };

    const openGuestPicker = () => {
        setIsDatePickerOpen(false);
        setIsGuestPickerOpen(true);
    };

    const closePickers = () => {
        setIsDatePickerOpen(false);
        setIsGuestPickerOpen(false);
    };

    const isPickerOpen = isDatePickerOpen || isGuestPickerOpen;

    const hasDatesData = checkIn !== null;
    const hasGuestsData = guests.adults > 0 || guests.infants > 0 || guests.pets > 0;

    const openMobileStep = (segment: MobileSearchSegment) => {
        closePickers();
        onMobileSegmentClick?.(segment);
    };

    const handleLocationFocus = () => {
        if (onMobileSegmentClick) {
            openMobileStep('location');
            return;
        }
        closePickers();
    };

    if (onMobileSearchOpen) {
        return (
            <div
                className={`${styles.searchBar} ${styles.mobileCompact} ${styles.searchBarTrigger}`}
                onClick={onMobileSearchOpen}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onMobileSearchOpen();
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <span className={styles.triggerText}>
                    {searchValue.trim() || wherePlaceholder}
                </span>

                <span className={styles.searchSubmit} aria-hidden="true">
                    <img src={searchIcon} alt="" className={styles.searchIcon} />
                </span>
            </div>
        );
    }

    return (
        <div className={`${styles.searchBar} ${mobileCompact ? styles.mobileCompact : ''} ${isPickerOpen ? styles.searchBarPickerOpen : ''}`}>
            {isPickerOpen && (
                <button
                    type="button"
                    className={styles.pickerBackdrop}
                    aria-label={t('booking.close')}
                    onClick={closePickers}
                />
            )}

            <div className={styles.inputWrapper}>
                <Input
                    variant="search"
                    placeholder={wherePlaceholder}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        setCity(e.target.value);
                    }}
                    recentSearches={onMobileSegmentClick ? [] : recentSearches}
                    recommended={onMobileSegmentClick ? [] : RECOMMENDED_CITIES}
                    searchResults={onMobileSegmentClick ? [] : searchResults}
                    onItemSelect={handleItemSelect}
                    dropdownClassName={styles.locationDropdown}
                    onFocus={handleLocationFocus}
                    onClick={onMobileSegmentClick ? () => openMobileStep('location') : undefined}
                    readOnly={Boolean(onMobileSegmentClick)}
                />
            </div>

            <span className={styles.divider} />

            <div className={`${styles.segmentAnchor} ${styles.segmentAnchorDates}`}>
                <button
                    type="button"
                    className={`${styles.searchBtn} ${hasDatesData ? styles.hasData : ''}`}
                    onClick={() => (onMobileSegmentClick ? openMobileStep('dates') : openDatePicker())}
                    aria-expanded={isDatePickerOpen}
                >
                    {datesText}
                </button>

                {!onMobileSegmentClick && (
                    <DatePicker
                        isOpen={isDatePickerOpen}
                        onClose={() => setIsDatePickerOpen(false)}
                        startDate={checkIn}
                        endDate={checkOut}
                        onChange={setDates}
                        flexibility={flexibility}
                        onFlexibilityChange={setFlexibility}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        flexDuration={flexDuration}
                        onFlexDurationChange={setFlexDuration}
                    selectedFlexMonths={selectedFlexMonths}
                    onFlexMonthsChange={setSelectedFlexMonths}
                    anchor="dates"
                />
                )}
            </div>

            <span className={styles.divider} />

            <div className={`${styles.segmentAnchor} ${styles.segmentAnchorGuests}`}>
                <button
                    type="button"
                    className={`${styles.searchBtn} ${hasGuestsData ? styles.hasData : ''}`}
                    onClick={() => (onMobileSegmentClick ? openMobileStep('guests') : openGuestPicker())}
                    aria-expanded={isGuestPickerOpen}
                >
                    {guestsText}
                </button>

                {!onMobileSegmentClick && (
                    <GuestPicker
                        isOpen={isGuestPickerOpen}
                        onClose={() => setIsGuestPickerOpen(false)}
                        guests={guests}
                        onChange={setGuests}
                        anchor="guests"
                    />
                )}
            </div>

            <button
                className={styles.searchSubmit}
                aria-label={t('header.search')}
                onClick={handleSearchSubmit}
            >
                <img src={searchIcon} alt="" className={styles.searchIcon} />
            </button>
        </div>
    );
};
