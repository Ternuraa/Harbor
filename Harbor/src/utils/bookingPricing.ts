import { calculateNights } from './searchParams';

export interface BookingPriceBreakdown {
    nights: number;
    subtotal: number;
    weeklyDiscount: number;
    taxes: number;
    total: number;
    taxesIncluded: boolean;
}

const TAX_RATE = 0.077;
const WEEKLY_DISCOUNT_RATE = 0.043;

export const calculateTaxForStay = (pricePerNight: number, nights: number) => {
    const subtotal = pricePerNight * nights;
    return Math.round(subtotal * TAX_RATE);
};

export const calculateBookingBreakdown = (
    pricePerNight: number,
    checkIn: Date | null,
    checkOut: Date | null,
    noCommission = false,
): BookingPriceBreakdown => {
    const nights = calculateNights(checkIn, checkOut);
    const subtotal = pricePerNight * nights;
    const weeklyDiscount = nights >= 7 ? Math.round(subtotal * WEEKLY_DISCOUNT_RATE) : 0;
    const taxable = subtotal - weeklyDiscount;
    const taxes = noCommission ? 0 : Math.round(taxable * TAX_RATE);
    const total = noCommission ? taxable : taxable + taxes;

    return {
        nights,
        subtotal,
        weeklyDiscount,
        taxes,
        total,
        taxesIncluded: noCommission,
    };
};

export const formatMoney = (amount: number, locale: string) =>
    `${amount.toLocaleString(locale)} ₽`;

export const resolveBookingPriceDetails = (
    booking: {
        pricePerNight?: number;
        subtotal?: number;
        taxes?: number;
        totalPrice: number;
    },
    checkIn: Date | null,
    checkOut: Date | null,
    property?: {
        pricePerNight: number;
        noCommission?: boolean;
    },
) => {
    const nights = calculateNights(checkIn, checkOut);
    if (nights <= 0) return null;

    const hasSnapshot = booking.pricePerNight != null && booking.subtotal != null;
    if (hasSnapshot) {
        const taxes = booking.taxes ?? 0;
        return {
            pricePerNight: booking.pricePerNight!,
            subtotal: booking.subtotal!,
            taxes,
            nights,
            showTaxes: taxes > 0,
        };
    }

    if (property && checkIn && checkOut) {
        const breakdown = calculateBookingBreakdown(
            property.pricePerNight,
            checkIn,
            checkOut,
            property.noCommission,
        );
        const subtotal = breakdown.subtotal - breakdown.weeklyDiscount;
        const taxes = breakdown.taxes;
        return {
            pricePerNight: property.pricePerNight,
            subtotal,
            taxes,
            nights,
            showTaxes: taxes > 0,
        };
    }

    const pricePerNight = Math.round(booking.totalPrice / nights);
    return {
        pricePerNight,
        subtotal: booking.totalPrice,
        taxes: 0,
        nights,
        showTaxes: false,
    };
};
