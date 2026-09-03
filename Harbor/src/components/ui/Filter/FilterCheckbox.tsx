import React from 'react';
import styles from './Filter.module.scss';

interface FilterCheckboxProps {
    label: string;
    count?: number; // Количество вариантов (например: "Отели (145)")
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, count, checked, onChange }) => {
    return (
        <label className={styles.checkboxWrapper}>
            <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className={`${styles.customCheckbox} ${checked ? styles.checked : ''}`}>
                {checked && (
                    <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.00004 7.8L1.20004 5L0.266708 5.93333L4.00004 9.66667L12 1.66667L11.0667 0.733334L4.00004 7.8Z" fill="white" />
                    </svg>
                )}
            </div>
            <span className={styles.labelText}>{label}</span>
            {count !== undefined && <span className={styles.countText}>{count}</span>}
        </label>
    );
};