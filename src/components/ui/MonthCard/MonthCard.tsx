import React from 'react';
import styles from './MonthCard.module.scss';

interface MonthCardProps {
    month: string;
    year: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const MonthCard: React.FC<MonthCardProps> = ({ month, year, isActive = false, onClick }) => {
    return (
        <div className={`${styles.monthCard} ${isActive ? styles.active : ''}`} onClick={onClick}>
            {/* Красивая SVG-иконка календаря */}
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className={styles.monthName}>{month}</span>
            <span className={styles.yearName}>{year}</span>
        </div>
    );
};