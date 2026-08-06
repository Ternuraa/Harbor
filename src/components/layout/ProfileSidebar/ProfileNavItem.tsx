import React from 'react';
import styles from './ProfileNavItem.module.scss';

interface ProfileNavItemProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const ProfileNavItem: React.FC<ProfileNavItemProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            type="button"
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={onClick}
        >
            {label}
        </button>
    );
};