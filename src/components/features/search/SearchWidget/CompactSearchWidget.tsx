import React from 'react';
import styles from './CompactSearchWidget.module.scss';

interface CompactSearchWidgetProps {
    location?: string;
    dates?: string;
    guests?: string;
    onClick?: () => void;
}

export const CompactSearchWidget: React.FC<CompactSearchWidgetProps> = ({
    location = 'Любое место',
    dates = 'Любая неделя',
    guests = 'Добавить гостей',
    onClick
}) => {
    return (
        <div className={styles.widgetContainer} onClick={onClick}>
            
            <button className={styles.widgetBtn}>{location}</button>

            <span className={styles.divider}></span>

            <button className={styles.widgetBtn}>{dates}</button>

            <span className={styles.divider}></span>

            <button className={`${styles.widgetBtn} ${styles.guestsBtn}`}>{guests}</button>

            <div className={styles.searchIconBtn}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className={styles.icon}>
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                </svg>
            </div>
        </div>
    );
};