import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './SearchBar.module.scss';

import searchIcon from '../../components/ui/icons/Search.svg';

import { Input, type SearchItem } from '../Input/Input';

import { useDebounce } from '../../hooks/useDebounce';

import { DatePicker } from '../../components/ui/DatePicker/DatePicker';

import { GuestPicker } from '../../components/ui/GuestPicker/GuestPicker';

import { useSearch } from '../../context/SearchContext';

import {

    addRecentSearch,

    filterLocalCities,

    getRecentSearches,

    mergeSearchResults,

    RECOMMENDED_CITIES,

} from '../../utils/recentSearches';

import { buildSearchQueryString, formatDatesRange, formatGuestsLabel } from '../../utils/searchParams';

import { useTranslation } from '../../i18n/useTranslation';



interface SearchBarProps {

    onSummaryChange?: (summary: { location: string; dates: string; guests: string }) => void;

}



export const SearchBar: React.FC<SearchBarProps> = ({ onSummaryChange }) => {

    const navigate = useNavigate();

    const { language, t } = useTranslation();

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



    const datesText = formatDatesRange(checkIn, checkOut, language);

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



    const hasDatesData = checkIn !== null;
    const hasGuestsData = guests.adults > 0 || guests.infants > 0 || guests.pets > 0;

    return (

        <div className={styles.searchBar}>

            <div className={styles.inputWrapper}>

                <Input

                    variant="search"

                    placeholder={wherePlaceholder}

                    value={searchValue}

                    onChange={(e) => {

                        setSearchValue(e.target.value);

                        setCity(e.target.value);

                    }}

                    recentSearches={recentSearches}

                    recommended={RECOMMENDED_CITIES}

                    searchResults={searchResults}

                    onItemSelect={handleItemSelect}

                    dropdownClassName={styles.locationDropdown}

                    onFocus={() => {

                        setIsDatePickerOpen(false);

                        setIsGuestPickerOpen(false);

                    }}

                />

            </div>



            <span className={styles.divider}></span>



            <button

                className={`${styles.searchBtn} ${hasDatesData ? styles.hasData : ''}`}

                onClick={openDatePicker}

            >

                {datesText}

            </button>



            <span className={styles.divider}></span>



            <button

                className={`${styles.searchBtn} ${hasGuestsData ? styles.hasData : ''}`}

                onClick={openGuestPicker}

            >

                {guestsText}

            </button>



            <button

                className={styles.searchSubmit}

                aria-label={t('header.search')}

                onClick={handleSearchSubmit}

            >

                <img src={searchIcon} alt="" className={styles.searchIcon} />

            </button>



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
            />



            <GuestPicker

                isOpen={isGuestPickerOpen}

                onClose={() => setIsGuestPickerOpen(false)}

                guests={guests}

                onChange={setGuests}

            />

        </div>

    );

};


