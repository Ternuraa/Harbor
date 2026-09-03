import React, { useState, useEffect } from 'react';
import styles from './HeaderSearch.module.scss';
import { CompactSearchWidget } from './CompactSearchWidget';
import { SearchWidget } from './SearchWidget'; // 🛑 Подключаем настоящий виджет поиска

export const HeaderSearch: React.FC = () => {
    // Состояние: раскрыт поиск или свернут
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden'; // Блокируем скролл страницы при открытом поиске
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isExpanded]);

    return (
        <>
            <div className={styles.searchContainer}>
                {/* 1. КОМПАКТНЫЙ ВАРИАНТ (Показываем, если поиск свернут) */}
                <div className={`${styles.compactWrapper} ${isExpanded ? styles.hidden : ''}`}>
                    <CompactSearchWidget onClick={() => setIsExpanded(true)} />
                </div>

                {/* 2. РАСКРЫТЫЙ ВАРИАНТ (Показываем, если кликнули на компактный виджет) */}
                <div className={`${styles.expandedWrapper} ${isExpanded ? styles.visible : ''}`}>
                    {/* 🛑 Передаем функцию закрытия внутрь виджета */}
                    <SearchWidget onClose={() => setIsExpanded(false)} />
                </div>
            </div>

            {/* 3. ЗАТЕМНЕНИЕ ФОНА (Overlay) */}
            <div
                className={`${styles.overlay} ${isExpanded ? styles.overlayVisible : ''}`}
                onClick={() => setIsExpanded(false)}
            />
        </>
    );
};