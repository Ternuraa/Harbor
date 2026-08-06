import { useEffect, type RefObject } from 'react';

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: () => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            // Если мы кликнули по самому виджету (или внутри него), ничего не делаем
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            // Если клик был снаружи — запускаем функцию закрытия
            handler();
        };

        // Подписываемся на события клика мыши и касания экрана
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Очищаем слушатели, когда компонент удаляется со страницы
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};