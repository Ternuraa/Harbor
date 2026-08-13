import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { GuestsState } from '../components/ui/GuestPicker/GuestPicker';
import type { SearchState, SearchSummary } from '../types/search';
import type { BookedDateRange } from '../types/property';
import {
    buildPropertyUrl,
    buildBookingUrl,
    buildSearchUrl,
    createDefaultSearchState,
    formatDatesRange,
    formatGuestsLabel,
    loadSearchState,
    parseSearchParams,
    saveSearchState,
} from '../utils/searchParams';

interface SearchContextType {
    city: string;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: GuestsState;
    summary: SearchSummary;
    setCity: (city: string) => void;
    setDates: (dates: { start: Date | null; end: Date | null }) => void;
    setGuests: (guests: GuestsState) => void;
    propertyBookedDates: BookedDateRange[] | null;
    setPropertyBookedDates: (dates: BookedDateRange[] | null) => void;
    buildSearchUrl: () => string;
    buildPropertyUrl: (propertyId: number) => string;
    buildBookingUrl: (propertyId: number) => string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const mergeSearchState = (current: SearchState, patch: Partial<SearchState>): SearchState => ({
    city: patch.city ?? current.city,
    checkIn: patch.checkIn !== undefined ? patch.checkIn : current.checkIn,
    checkOut: patch.checkOut !== undefined ? patch.checkOut : current.checkOut,
    guests: patch.guests ?? current.guests,
});

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<SearchState>(() => loadSearchState() ?? createDefaultSearchState());
    const [propertyBookedDates, setPropertyBookedDates] = useState<BookedDateRange[] | null>(null);

    const urlSnapshot = (() => {
        const shouldHydrateFromUrl =
            location.pathname === '/search'
            || location.pathname.startsWith('/property/');

        if (!shouldHydrateFromUrl) return null;

        const fromUrl = parseSearchParams(searchParams);
        const hasUrlData = Boolean(
            fromUrl.city
            || fromUrl.checkIn
            || fromUrl.checkOut
            || fromUrl.guests,
        );

        return hasUrlData ? fromUrl : null;
    })();

    const urlKey = `${location.pathname}?${searchParams.toString()}`;
    const [hydratedUrlKey, setHydratedUrlKey] = useState<string | null>(null);

    if (urlKey !== hydratedUrlKey) {
        setHydratedUrlKey(urlKey);
        if (urlSnapshot) {
            setState((current) => mergeSearchState(current, urlSnapshot));
        }
    }

    useEffect(() => {
        saveSearchState(state);
    }, [state]);

    const setCity = useCallback((city: string) => {
        setState((current) => ({ ...current, city }));
    }, []);

    const setDates = useCallback((dates: { start: Date | null; end: Date | null }) => {
        setState((current) => ({
            ...current,
            checkIn: dates.start,
            checkOut: dates.end,
        }));
    }, []);

    const setGuests = useCallback((guests: GuestsState) => {
        setState((current) => ({ ...current, guests }));
    }, []);

    const getSearchUrl = useCallback(() => buildSearchUrl(state), [state]);
    const getPropertyUrl = useCallback((propertyId: number) => buildPropertyUrl(propertyId, state), [state]);
    const getBookingUrl = useCallback((propertyId: number) => buildBookingUrl(propertyId, state), [state]);

    const summary = useMemo<SearchSummary>(() => ({
        location: state.city.trim() || 'Куда?',
        dates: formatDatesRange(state.checkIn, state.checkOut),
        guests: formatGuestsLabel(state.guests),
    }), [state]);

    const value = useMemo(
        () => ({
            city: state.city,
            checkIn: state.checkIn,
            checkOut: state.checkOut,
            guests: state.guests,
            summary,
            setCity,
            setDates,
            setGuests,
            propertyBookedDates,
            setPropertyBookedDates,
            buildSearchUrl: getSearchUrl,
            buildPropertyUrl: getPropertyUrl,
            buildBookingUrl: getBookingUrl,
        }),
        [state, summary, setCity, setDates, setGuests, propertyBookedDates, getSearchUrl, getPropertyUrl, getBookingUrl],
    );

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
};
