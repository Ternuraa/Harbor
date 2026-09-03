import { format, parseISO, differenceInCalendarDays, isValid } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import type { GuestsState } from '../components/ui/GuestPicker/GuestPicker';
import type { SearchState } from '../types/search';
import { getTranslation } from '../i18n';
import type { Language } from '../i18n/types';
import { getStoredLanguage } from '../i18n/languageStorage';

const STORAGE_KEY = 'harbor-search-state';

const DEFAULT_GUESTS: GuestsState = {
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
};

export const createDefaultSearchState = (): SearchState => ({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: { ...DEFAULT_GUESTS },
});

const getDateLocale = (language: Language) => language === 'ru' ? ru : enUS;

const getPlural = (number: number, one: string, few: string, many: string, language: Language) => {
    if (languageIsEnglish(language)) {
        return number === 1 ? one : many;
    }

    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return many;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
};

const languageIsEnglish = (language: Language) => language === 'en';

export const formatDateLabel = (
    date: Date | null,
    language: Language = getStoredLanguage(),
    fallback?: string,
) => {
    const dict = getTranslation(language);
    const fb = fallback ?? dict.header.addDate;
    if (!date || !isValid(date)) return fb;
    return format(date, 'd MMM yyyy', { locale: getDateLocale(language) });
};

export const formatDatesRange = (
    checkIn: Date | null,
    checkOut: Date | null,
    language: Language = getStoredLanguage(),
) => {
    const dict = getTranslation(language);
    const locale = getDateLocale(language);

    if (checkIn && checkOut) {
        return `${format(checkIn, 'd MMM', { locale })} – ${format(checkOut, 'd MMM yyyy', { locale })}`;
    }
    if (checkIn) return format(checkIn, 'd MMM yyyy', { locale });
    return dict.header.when;
};

export const formatDatesRangeCompact = (
    checkIn: Date | null,
    checkOut: Date | null,
    language: Language = getStoredLanguage(),
) => {
    const dict = getTranslation(language);
    const locale = getDateLocale(language);

    if (checkIn && checkOut) {
        const sameMonth = checkIn.getMonth() === checkOut.getMonth()
            && checkIn.getFullYear() === checkOut.getFullYear();

        if (sameMonth) {
            return `${format(checkIn, 'd', { locale })}–${format(checkOut, 'd MMM', { locale })}`;
        }

        return `${format(checkIn, 'd MMM', { locale })} – ${format(checkOut, 'd MMM', { locale })}`;
    }

    if (checkIn) return format(checkIn, 'd MMM', { locale });
    return dict.header.when;
};

export const formatNightsLabel = (
    nights: number,
    language: Language = getStoredLanguage(),
) => {
    const dict = getTranslation(language);
    const label = getPlural(
        nights,
        dict.mobileSearch.nightOne,
        dict.mobileSearch.nightFew,
        dict.mobileSearch.nightMany,
        language,
    );
    return `${nights} ${label}`;
};

export const formatMobileDateField = (
    date: Date | null,
    language: Language = getStoredLanguage(),
    fallback = '',
) => {
    if (!date || !isValid(date)) return fallback;
    const locale = getDateLocale(language);
    return format(date, 'd MMM, EEE', { locale }).replace(/\./g, '');
};

export const formatMobileSearchSubtitle = (
    checkIn: Date | null,
    checkOut: Date | null,
    guests: GuestsState,
    language: Language = getStoredLanguage(),
) => {
    const dict = getTranslation(language);
    const locale = getDateLocale(language);
    const totalGuests = Math.max(guests.adults + guests.children, 1);
    const guestsPart = `${totalGuests} ${getPlural(
        totalGuests,
        dict.search.guestOne,
        dict.search.guestFew,
        dict.search.guestMany,
        language,
    )}`;

    if (checkIn && checkOut) {
        const datesPart = `${format(checkIn, 'd', { locale })} — ${format(checkOut, 'd MMM', { locale })}`.replace('.', '');
        const nights = calculateNights(checkIn, checkOut);
        const nightsPart = formatNightsLabel(nights, language);
        return `${datesPart}, ${nightsPart}, ${guestsPart}`;
    }

    return `${dict.mobileSearch.selectDates}, ${guestsPart}`;
};

export const formatGuestsLabel = (
    guests: GuestsState,
    language: Language = getStoredLanguage(),
) => {
    const dict = getTranslation(language);
    const totalGuests = guests.adults + guests.children;
    const parts: string[] = [];

    if (totalGuests > 0) {
        parts.push(
            `${totalGuests} ${getPlural(totalGuests, dict.search.guestOne, dict.search.guestFew, dict.search.guestMany, language)}`,
        );
    }
    if (guests.infants > 0) {
        parts.push(
            `${guests.infants} ${getPlural(guests.infants, dict.search.infantOne, dict.search.infantFew, dict.search.infantMany, language)}`,
        );
    }
    if (guests.pets > 0) {
        parts.push(
            `${guests.pets} ${getPlural(guests.pets, dict.search.petOne, dict.search.petFew, dict.search.petMany, language)}`,
        );
    }

    if (parts.length === 0) return dict.header.who;
    return parts.join(', ');
};

export const getTotalGuests = (guests: GuestsState) =>
    guests.adults + guests.children + guests.infants;

export const toISODate = (date: Date | null) => {
    if (!date || !isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
};

export const parseISODate = (value: string | null): Date | null => {
    if (!value) return null;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
};

export const getLocalDateStartMs = (value: string | null): number | null => {
    if (!value) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
        const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        date.setHours(0, 0, 0, 0);
        return Number.isNaN(date.getTime()) ? null : date.getTime();
    }

    const parsed = parseISODate(value);
    if (!parsed) return null;
    parsed.setHours(0, 0, 0, 0);
    return parsed.getTime();
};

export const isBookingUpcoming = (checkOut: string, todayStart: number) => {
    const checkOutStart = getLocalDateStartMs(checkOut);
    if (checkOutStart === null) return true;
    return checkOutStart >= todayStart;
};

export const parseSearchParams = (params: URLSearchParams): Partial<SearchState> => {
    const city = params.get('city') ?? '';
    const checkIn = parseISODate(params.get('checkIn'));
    const checkOut = parseISODate(params.get('checkOut'));

    const adults = Number(params.get('adults') ?? 0);
    const children = Number(params.get('children') ?? 0);
    const infants = Number(params.get('infants') ?? 0);
    const pets = Number(params.get('pets') ?? 0);

    const hasGuests = [adults, children, infants, pets].some((value) => value > 0);

    return {
        city,
        checkIn,
        checkOut,
        guests: hasGuests
            ? {
                adults: Number.isFinite(adults) ? adults : 0,
                children: Number.isFinite(children) ? children : 0,
                infants: Number.isFinite(infants) ? infants : 0,
                pets: Number.isFinite(pets) ? pets : 0,
            }
            : undefined,
    };
};

export const buildSearchQueryString = (state: SearchState): string => {
    const params = new URLSearchParams();

    if (state.city.trim()) {
        params.set('city', state.city.trim());
    }

    const checkIn = toISODate(state.checkIn);
    const checkOut = toISODate(state.checkOut);

    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    if (state.guests.adults > 0) params.set('adults', String(state.guests.adults));
    if (state.guests.children > 0) params.set('children', String(state.guests.children));
    if (state.guests.infants > 0) params.set('infants', String(state.guests.infants));
    if (state.guests.pets > 0) params.set('pets', String(state.guests.pets));

    return params.toString();
};

export const buildSearchUrl = (state: SearchState) => {
    const query = buildSearchQueryString(state);
    return query ? `/search?${query}` : '/search';
};

export const buildPropertyUrl = (propertyId: number, state: SearchState) => {
    const query = buildSearchQueryString(state);
    return query ? `/property/${propertyId}?${query}` : `/property/${propertyId}`;
};

export const buildBookingUrl = (propertyId: number, state: SearchState) => {
    const query = buildSearchQueryString(state);
    return query ? `/property/${propertyId}/book?${query}` : `/property/${propertyId}/book`;
};

export const calculateNights = (checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut || !isValid(checkIn) || !isValid(checkOut)) return 0;
    const nights = differenceInCalendarDays(checkOut, checkIn);
    return nights > 0 ? nights : 0;
};

export const calculateTotalPrice = (pricePerNight: number, checkIn: Date | null, checkOut: Date | null) => {
    const nights = calculateNights(checkIn, checkOut);
    return nights > 0 ? pricePerNight * nights : 0;
};

interface StoredSearchState {
    city: string;
    checkIn: string | null;
    checkOut: string | null;
    guests: GuestsState;
}

export const saveSearchState = (state: SearchState) => {
    try {
        const payload: StoredSearchState = {
            city: state.city,
            checkIn: toISODate(state.checkIn) || null,
            checkOut: toISODate(state.checkOut) || null,
            guests: state.guests,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // ignore
    }
};

export const loadSearchState = (): SearchState | null => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as StoredSearchState;
        return {
            city: parsed.city ?? '',
            checkIn: parseISODate(parsed.checkIn),
            checkOut: parseISODate(parsed.checkOut),
            guests: parsed.guests ?? { ...DEFAULT_GUESTS },
        };
    } catch {
        return null;
    }
};

export const hasSearchData = (state: SearchState) =>
    Boolean(
        state.city.trim()
        || state.checkIn
        || state.checkOut
        || state.guests.adults > 0
        || state.guests.children > 0
        || state.guests.infants > 0
        || state.guests.pets > 0,
    );
