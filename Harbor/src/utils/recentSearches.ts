import type { SearchItem } from '../components/ui/Input/Input';

const STORAGE_KEY = 'harbor-recent-searches';
const MAX_RECENT = 1;

export const RECOMMENDED_CITIES: SearchItem[] = [
    { city: 'Москва', country: 'Россия' },
    { city: 'Санкт-Петербург', country: 'Россия' },
];

export const POPULAR_DESTINATIONS: SearchItem[] = [
    { city: 'Санкт-Петербург', country: 'Санкт-Петербург и область, Россия' },
    { city: 'Москва', country: 'Москва и область, Россия' },
];

export const getRecentSearches = (): SearchItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as SearchItem[];
        return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
    } catch {
        return [];
    }
};

export const addRecentSearch = (city: string, country = 'Россия') => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    const normalized = trimmedCity.toLowerCase();
    const withoutDuplicate = getRecentSearches().filter(
        (item) => item.city.toLowerCase() !== normalized
    );

    const updated: SearchItem[] = [
        { city: trimmedCity, country },
        ...withoutDuplicate,
    ].slice(0, MAX_RECENT);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const filterLocalCities = (
    query: string,
    source: SearchItem[] = RECOMMENDED_CITIES,
): SearchItem[] => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return source.filter(
        (item) =>
            item.city.toLowerCase().includes(normalized)
            || item.country.toLowerCase().includes(normalized),
    );
};

export const mergeSearchResults = (
    localResults: SearchItem[],
    remoteResults: SearchItem[]
): SearchItem[] => {
    const seen = new Set<string>();
    const merged: SearchItem[] = [];

    [...localResults, ...remoteResults].forEach((item) => {
        const key = item.city.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        merged.push(item);
    });

    return merged;
};
