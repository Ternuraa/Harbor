import type { Booking, BookingPayload } from '../types/search';
import { API_URL } from '../config/api';

const authHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const fetchBookings = async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/bookings`, {
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить бронирования');
    }

    const data = await response.json();
    return Array.isArray(data.bookings) ? data.bookings : [];
};

export const fetchBookingById = async (token: string, bookingId: number): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить детали бронирования');
    }

    const data = await response.json();
    return data.booking as Booking;
};

export const cancelBooking = async (token: string, bookingId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });

    if (!response.ok) {
        throw new Error('Не удалось отменить бронирование');
    }
};

export const createBooking = async (token: string, payload: BookingPayload): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Не удалось забронировать' }));
        throw new Error(error.error || 'Не удалось забронировать');
    }

    const data = await response.json();
    return data.booking;
};
