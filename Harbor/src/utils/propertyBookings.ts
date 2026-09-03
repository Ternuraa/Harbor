import { startOfDay, addDays, isAfter } from 'date-fns';
import type { BookedDateRange } from '../types/property';

const toDate = (value: string) => startOfDay(new Date(`${value}T00:00:00`));

const rangesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date) =>
    startA <= endB && startB <= endA;

export const isPropertyBookedForRange = (
    bookedDates: BookedDateRange[],
    start: Date,
    end: Date,
) =>
    bookedDates.some((range) =>
        rangesOverlap(
            startOfDay(start),
            startOfDay(end),
            toDate(range.start),
            toDate(range.end),
        ),
    );

export const isPropertyBookedOnDate = (bookedDates: BookedDateRange[], date: Date) => {
    const day = startOfDay(date);

    return bookedDates.some((range) => {
        const rangeStart = toDate(range.start);
        const rangeEnd = toDate(range.end);
        return day >= rangeStart && day <= rangeEnd;
    });
};

export const rangeIncludesBookedDate = (
    bookedDates: BookedDateRange[],
    start: Date,
    end: Date,
) => {
    let cursor = startOfDay(start);
    const lastDay = startOfDay(end);

    while (!isAfter(cursor, lastDay)) {
        if (isPropertyBookedOnDate(bookedDates, cursor)) {
            return true;
        }
        cursor = addDays(cursor, 1);
    }

    return false;
};
