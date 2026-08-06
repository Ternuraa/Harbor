import type { Property } from '../types/property';
import type { Language } from '../i18n/types';
import { enPropertyLocales } from '../i18n/propertyLocales/en';

export const localizeProperty = (property: Property, language: Language): Property => {
    if (language === 'ru') {
        return property;
    }

    const locale = enPropertyLocales[property.id];
    if (!locale) {
        return property;
    }

    return {
        ...property,
        title: locale.title,
        location: locale.location,
        description: locale.description,
        amenities: property.amenities.map((amenity, index) => ({
            ...amenity,
            name: locale.amenities[index] ?? amenity.name,
        })),
        host: {
            ...property.host,
            about: locale.host?.about ?? property.host.about,
        },
        locationDetails: property.locationDetails && locale.locationDetails
            ? {
                ...property.locationDetails,
                address: locale.locationDetails.address,
                neighborhood: locale.locationDetails.neighborhood,
                description: locale.locationDetails.description,
                transport: property.locationDetails.transport.map((item, index) => ({
                    ...item,
                    name: locale.locationDetails?.transport[index]?.name ?? item.name,
                })),
                infrastructure: property.locationDetails.infrastructure.map((item, index) => ({
                    ...item,
                    name: locale.locationDetails?.infrastructure[index]?.name ?? item.name,
                })),
            }
            : property.locationDetails,
    };
};

export const localizeProperties = (properties: Property[], language: Language): Property[] =>
    properties.map((property) => localizeProperty(property, language));

export const getLocaleForNumber = (language: Language) => language === 'en' ? 'en-US' : 'ru-RU';

export const formatPerNight = (price: number, language: Language) =>
    `${price.toLocaleString(getLocaleForNumber(language))} ₽`;

export const formatTotalForNights = (pricePerNight: number, nights: number, language: Language) => {
    const total = pricePerNight * nights;
    const formatted = total.toLocaleString(getLocaleForNumber(language));

    if (language === 'en') {
        const nightLabel = nights === 1 ? 'night' : 'nights';
        return `${formatted} ₽ for ${nights} ${nightLabel}`;
    }

    const nightWord = nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей';
    return `${formatted} ₽ за ${nights} ${nightWord}`;
};

export const getNightLabel = (nights: number, language: Language) => {
    if (language === 'en') {
        return nights === 1 ? 'night' : 'nights';
    }
    return nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей';
};
