import type { GuestsState } from '../components/ui/GuestPicker/GuestPicker';

export interface SearchState {
    city: string;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: GuestsState;
}

export interface SearchSummary {
    location: string;
    dates: string;
    guests: string;
}

export interface BookingPayload {
    propertyId: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    infants: number;
    pets: number;
    totalPrice: number;
    hostMessage?: string;
    paymentTiming?: 'now' | 'later';
    propertyTitle?: string;
    propertyImageUrl?: string;
    propertyLocation?: string;
    propertyType?: string;
    hostName?: string;
    pricePerNight?: number;
    subtotal?: number;
    taxes?: number;
}

export interface Booking {
    id: number;
    propertyId: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    infants: number;
    pets: number;
    totalPrice: number;
    createdAt: string;
    status?: string;
    propertyTitle?: string;
    propertyImageUrl?: string;
    propertyLocation?: string;
    propertyType?: string;
    hostName?: string;
    hostMessage?: string;
    paymentTiming?: 'now' | 'later';
    pricePerNight?: number;
    subtotal?: number;
    taxes?: number;
}
