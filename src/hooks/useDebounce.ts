import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    // Состояние для хранения отложенного значения
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Устанавливаем таймер. Значение обновится только через delay миллисекунд
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Если value изменилось ДО истечения таймера (пользователь продолжает печатать),
        // мы очищаем старый таймер и запускаем новый.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Эффект перезапускается при изменении value или delay

    return debouncedValue;
}