import React from 'react';
import styles from './Tabs.module.scss';

export interface TabOption {
    label: string;
    value: string;
}

interface TabsProps {
    options: TabOption[];
    activeValue: string;
    onChange: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ options, activeValue, onChange }) => {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabsContainer}>
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`${styles.tab} ${activeValue === option.value ? styles.active : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};