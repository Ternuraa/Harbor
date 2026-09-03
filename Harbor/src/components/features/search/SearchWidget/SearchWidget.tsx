import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 🛑 Хук для перехода между страницами
import styles from './SearchWidget.module.scss';
import { useClickOutside } from '../../../../hooks/useClickOutside';

type ActiveTab = 'location' | 'dates' | 'guests' | null;

interface SearchWidgetProps {
    onClose?: () => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onClose }) => {
    const navigate = useNavigate();

    // При открытии большого виджета сразу активируем первую вкладку "Где"
    const [activeTab, setActiveTab] = useState<ActiveTab>('location');
    const [searchQuery, setSearchQuery] = useState('');

    const widgetRef = useRef<HTMLDivElement>(null);

    // Если кликнули вне виджета — закрываем всю панель через родителя
    useClickOutside(widgetRef, () => {
        if (onClose) onClose();
    });

    const handleTabClick = (tab: ActiveTab) => {
        setActiveTab(tab);
    };

    // 🛑 ГЛАВНАЯ ФУНКЦИЯ ПОИСКА
    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Формируем красивый URL с параметром города
            navigate(`/search?city=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // Если ничего не ввели, просто открываем все варианты
            navigate('/search');
        }

        if (onClose) onClose(); // Сворачиваем поисковую панель в шапке
    };

    // Список популярных направлений для быстрого выбора
    const recommendedDestinations = [
        { city: 'Санкт-Петербург', country: 'Россия' },
        { city: 'Москва', country: 'Россия' },
        { city: 'Калининград', country: 'Россия' },
        { city: 'Минеральные Воды', country: 'Россия' }
    ];

    const handleSelectCity = (city: string) => {
        setSearchQuery(city);
        setActiveTab('dates'); // Airbnb-паттерн: автоматически переключаем на даты после выбора города
    };

    return (
        <div className={styles.widgetContainer} ref={widgetRef}>
            <div className={`${styles.pill} ${activeTab ? styles.pillActive : ''}`}>

                {/* СЕГМЕНТ: ГДЕ */}
                <div
                    className={`${styles.segment} ${activeTab === 'location' ? styles.segmentActive : ''}`}
                    onClick={() => handleTabClick('location')}
                >
                    <div className={styles.segmentText} style={{ width: '100%' }}>
                        <span className={styles.label}>Где</span>
                        {activeTab === 'location' ? (
                            <input
                                autoFocus
                                type="text"
                                className={styles.segmentInput}
                                placeholder="Поиск направлений"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onClick={(e) => e.stopPropagation()} // Чтобы клик по инпуту не закрывал таб
                            />
                        ) : (
                            <span className={styles.value}>{searchQuery || 'Поиск направлений'}</span>
                        )}
                    </div>
                </div>

                <div className={styles.divider} />

                {/* СЕГМЕНТ: КОГДА */}
                <div
                    className={`${styles.segment} ${activeTab === 'dates' ? styles.segmentActive : ''}`}
                    onClick={() => handleTabClick('dates')}
                >
                    <div className={styles.segmentText}>
                        <span className={styles.label}>Когда</span>
                        <span className={styles.value}>Добавьте даты</span>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* СЕГМЕНТ: КТО */}
                <div
                    className={`${styles.segment} ${styles.segmentLast} ${activeTab === 'guests' ? styles.segmentActive : ''}`}
                    onClick={() => handleTabClick('guests')}
                >
                    <div className={styles.segmentText}>
                        <span className={styles.label}>Кто</span>
                        <span className={styles.value}>Добавьте гостей</span>
                    </div>

                    {/* КНОПКА ОТПРАВКИ ФОРМЫ */}
                    <button
                        className={styles.searchButton}
                        onClick={(e) => {
                            e.stopPropagation(); // Предотвращаем срабатывание клика по сегменту
                            handleSearch();
                        }}
                    >
                        Искать
                    </button>
                </div>
            </div>

            {/* ВЫПАДАЮЩИЕ ОКНА (POPOVERS) */}
            {activeTab === 'location' && (
                <div className={styles.popover}>
                    <h3 className={styles.popoverTitle}>Рекомендуемые направления</h3>
                    <div className={styles.cityList}>
                        {recommendedDestinations
                            .filter(item => item.city.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.cityItem}
                                    onClick={() => handleSelectCity(item.city)}
                                >
                                    <div className={styles.cityIcon}>
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                                            <path d="M16 2C10.477 2 6 6.477 6 12c0 7.333 10 18 10 18s10-10.667 10-18c0-5.523-4.477-10-10-10zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className={styles.cityName}>{item.city}</div>
                                        <div className={styles.cityCountry}>{item.country}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {activeTab === 'dates' && (
                <div className={styles.popover}>
                    <h3>Выберите даты</h3>
                    <p style={{ color: '#8F8F8F', marginTop: '8px', fontSize: '14px' }}>Здесь скоро будет календарь...</p>
                </div>
            )}

            {activeTab === 'guests' && (
                <div className={styles.popover}>
                    <h3>Кто едет</h3>
                    <p style={{ color: '#8F8F8F', marginTop: '8px', fontSize: '14px' }}>Здесь скоро будут счетчики гостей...</p>
                </div>
            )}
        </div>
    );
};