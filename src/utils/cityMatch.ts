export const normalizeCity = (value: string) => value.trim().toLowerCase();

export const matchesCity = (propertyCity: string, query: string) => {
    const normalizedQuery = normalizeCity(query);
    const normalizedCity = normalizeCity(propertyCity);

    if (normalizedCity.includes(normalizedQuery) || normalizedQuery.includes(normalizedCity)) {
        return true;
    }

    if (
        normalizedQuery.includes('петербург') ||
        normalizedQuery.includes('спб') ||
        normalizedQuery.includes('petersburg') ||
        normalizedQuery.includes('spb') ||
        normalizedQuery.includes('saint')
    ) {
        return normalizedCity.includes('санкт-петербург') || normalizedCity.includes('saint petersburg');
    }

    if (
        normalizedQuery.includes('моск') ||
        normalizedQuery.includes('moscow') ||
        normalizedQuery.includes('mosk')
    ) {
        return normalizedCity.includes('москва') || normalizedCity.includes('moscow');
    }

    return false;
};

export const HOME_PROPERTIES_CITY = 'Санкт-Петербург';

export const filterPropertiesByCity = <T extends { city: string }>(
    properties: T[],
    city: string,
) => properties.filter((property) => matchesCity(property.city, city));
