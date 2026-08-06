import React from 'react';
import styles from './BackButton.module.scss';
import { BackIcon } from '../icons/BackIcon';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export const BackButton: React.FC<BackButtonProps> = ({
    children = 'Назад',
    className,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${className || ''}`}
            {...props}
        >
            <BackIcon className={styles.icon} />
            {children}
        </button>
    );
};
