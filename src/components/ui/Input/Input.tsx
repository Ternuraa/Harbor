import React, { useState, useRef, useEffect, type InputHTMLAttributes } from 'react';
// Исправлен импорт: теперь он точно ссылается на ваш SCSS файл
import styles from './Input.module.scss';

export interface SearchItem {
    city: string;
    country: string;
    dates?: string;
}

// Интерфейс InputProps теперь используется ниже
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'search';
    recentSearches?: SearchItem[];
    recommended?: SearchItem[];
    searchResults?: SearchItem[];
    onItemSelect?: (item: SearchItem) => void;
    dropdownClassName?: string;
}

// Вот здесь мы применяем InputProps (React.FC<InputProps>), поэтому ошибка TS6196 уйдет
export const Input: React.FC<InputProps> = ({
    variant = 'default',
    recentSearches,
    recommended,
    searchResults,
    onItemSelect,
    dropdownClassName,
    className,
    value,
    onChange,
    onFocus,
    ...inputRest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item: SearchItem) => {
        if (onItemSelect) onItemSelect(item);
        setIsOpen(false);
    };

    const hasInputValue = value && String(value).trim().length > 0;

    return (
        // Здесь мы применяем styles (styles.wrapper, styles.input и т.д.), поэтому ошибка TS6133 уйдет
        <div
            className={`${styles.wrapper} ${dropdownClassName ? styles.wrapperAnchored : ''} ${className || ''}`}
            ref={wrapperRef}
        >
            <input
                value={value}
                onChange={onChange}
                className={`${styles.input} ${styles[variant]}`}
                onFocus={(e) => {
                    if (!inputRest.readOnly) {
                        setIsOpen(true);
                    }
                    onFocus?.(e);
                }}
                {...inputRest}
            />

            {isOpen && variant === 'search' && !inputRest.readOnly && (
                <div
                    className={`${styles.dropdown} ${dropdownClassName ? styles.dropdownAnchored : ''} ${dropdownClassName || ''}`}
                >
                    {hasInputValue ? (
                        <div className={styles.section}>
                            {searchResults && searchResults.length > 0 ? (
                                searchResults.map((item, index) => (
                                    <div key={index} className={styles.item} onClick={() => handleSelect(item)}>
                                        <div className={styles.itemMain}>{item.city}</div>
                                        <div className={styles.itemSub}>{item.country}</div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyMessage}>Ничего не найдено</div>
                            )}
                        </div>
                    ) : (
                        <>
                            {recentSearches && recentSearches.length > 0 && (
                                <div className={styles.section}>
                                    <div className={styles.sectionTitle}>Недавние запросы</div>
                                    {recentSearches.map((item, index) => (
                                        <div key={index} className={styles.item} onClick={() => handleSelect(item)}>
                                            <div className={styles.itemMain}>{item.city}</div>
                                            {item.country && <div className={styles.itemSub}>{item.country}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recommended && recommended.length > 0 && (
                                <div className={styles.section}>
                                    <div className={styles.sectionTitle}>Рекомендуемые направления</div>
                                    {recommended.map((item, index) => (
                                        <div key={index} className={styles.item} onClick={() => handleSelect(item)}>
                                            <div className={styles.itemMain}>{item.city}</div>
                                            <div className={styles.itemSub}>{item.country}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};