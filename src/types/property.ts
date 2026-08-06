export interface BookedDateRange {
    start: string;
    end: string;
}

export interface PropertyAmenity {
    icon: string;
    name: string;
}

export interface PropertyHost {
    name: string;
    avatar: string;
    about?: string;
}

export interface PropertyLocationDetails {
    address: string;
    neighborhood: string;
    description: string;
    transport: Array<{ id: number; icon: string; name: string; time: string }>;
    infrastructure: Array<{ id: number; icon: string; name: string; time: string }>;
}

export interface Property {
    id: number;
    city: string;
    title: string;
    location: string;
    description: string;
    pricePerNight: number;
    totalPrice: string;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    images: string[];
    amenities: PropertyAmenity[];
    host: PropertyHost;
    isVerified?: boolean;
    noCommission?: boolean;
    propertyType?: string;
    /** Заголовок типа размещения, напр. «Квартира целиком» */
    roomType?: string;
    /** Краткие характеристики: гости, спальни, кровати, ванные */
    roomDetails?: string;
    amenityIds?: string[];
    bookedDates: BookedDateRange[];
    locationDetails?: PropertyLocationDetails;
}

export interface HarborDatabase {
    properties: Property[];
}
