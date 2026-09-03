import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
    text: string;
    variant: 'verified' | 'success' | 'confirmed' | 'completed' | 'ideas' | 'ideasTag';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, variant, className = '' }) => {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`.trim()}>
            {text}
        </span>
    );
};