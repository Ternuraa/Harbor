import type { Property } from '../types/property';
import { isPropertyBookedForRange } from './propertyBookings';

export interface SearchFiltersState {
    priceMin: number;
    priceMax: number;
    propertyTypes: string[];
    amenities: string[];
    minRating: number | null;
    verifiedOnly: boolean;
    noCommissionOnly: boolean;
}

export interface PriceBounds {
    min: number;
    max: number;
}

export const PROPERTY_TYPE_IDS = ['apartment', 'studio', 'room', 'house'] as const;
export const AMENITY_IDS = ['wifi', 'kitchen', 'washer', 'ac', 'parking', 'pets'] as const;
export const RATING_IDS = [4.5, 4, 3.5] as const;

export const getPriceBounds = (properties: Property[]): PriceBounds => {
    if (properties.length === 0) {
        return { min: 0, max: 50000 };
    }

    const prices = properties.map((property) => property.pricePerNight);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
};

export const createDefaultFilters = (bounds: PriceBounds): SearchFiltersState => ({
    priceMin: bounds.min,
    priceMax: bounds.max,
    propertyTypes: [],
    amenities: [],
    minRating: null,
    verifiedOnly: false,
    noCommissionOnly: false,
});

export const getPropertyType = (property: Property): string => {
    if (property.propertyType) return property.propertyType;

    const title = property.title.toLowerCase();

    if (title.includes('студия') || title.includes('studio')) return 'studio';
    if (title.includes('комната') || title.includes('room')) return 'room';
    if (title.includes('дом') || title.includes('коттедж') || title.includes('house')) return 'house';
    return 'apartment';
};

const amenityMatchers: Record<string, string[]> = {
    wifi: ['wi-fi', 'wi fi', 'wifi'],
    kitchen: ['кухня'],
    washer: ['стиральн'],
    ac: ['кондиционер'],
    parking: ['парковк'],
    pets: ['питомц', 'животн'],
};

export const propertyHasAmenity = (property: Property, amenityId: string): boolean => {
    if (property.amenityIds?.includes(amenityId)) {
        return true;
    }

    const matchers = amenityMatchers[amenityId] ?? [];
    const names = property.amenities.map((item) => item.name.toLowerCase()).join(' ');

    return matchers.some((matcher) => names.includes(matcher));
};

export const filterAvailableForDates = (
    properties: Property[],
    checkIn: Date | null,
    checkOut: Date | null,
): Property[] => {
    if (!checkIn || !checkOut) return properties;

    return properties.filter(
        (property) => !isPropertyBookedForRange(property.bookedDates ?? [], checkIn, checkOut),
    );
};

export const applySearchFilters = (
    properties: Property[],
    filters: SearchFiltersState
): Property[] =>
    properties.filter((property) => {
        if (property.pricePerNight < filters.priceMin || property.pricePerNight > filters.priceMax) {
            return false;
        }

        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(getPropertyType(property))) {
            return false;
        }

        if (filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every((amenityId) =>
                propertyHasAmenity(property, amenityId)
            );
            if (!hasAllAmenities) return false;
        }

        if (filters.minRating !== null && property.rating < filters.minRating) {
            return false;
        }

        if (filters.verifiedOnly && !property.isVerified) {
            return false;
        }

        if (filters.noCommissionOnly && !property.noCommission) {
            return false;
        }

        return true;
    });

export const countByPropertyType = (properties: Property[], typeId: string) =>
    properties.filter((property) => getPropertyType(property) === typeId).length;

export const countByAmenity = (properties: Property[], amenityId: string) =>
    properties.filter((property) => propertyHasAmenity(property, amenityId)).length;

export const countByMinRating = (properties: Property[], minRating: number) =>
    properties.filter((property) => property.rating >= minRating).length;

export const countVerified = (properties: Property[]) =>
    properties.filter((property) => property.isVerified).length;

export const countNoCommission = (properties: Property[]) =>
    properties.filter((property) => property.noCommission).length;

export const hasActiveFilters = (filters: SearchFiltersState, bounds: PriceBounds) =>
    filters.priceMin > bounds.min ||
    filters.priceMax < bounds.max ||
    filters.propertyTypes.length > 0 ||
    filters.amenities.length > 0 ||
    filters.minRating !== null ||
    filters.verifiedOnly ||
    filters.noCommissionOnly;
