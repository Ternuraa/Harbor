import React from 'react';
import styles from './Pill.module.scss';

interface PillProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const Pill: React.FC<PillProps> = ({ label, isActive = false, onClick }) => {
    return (
        <button
            type="button"
            className={`${styles.pill} ${isActive ? styles.active : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};