import React from 'react';
import styles from './ArrowButton.module.scss';
import { ChevronIcon } from '../icons/ChevronIcon';

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    direction: 'left' | 'right';
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({
    direction,
    disabled,
    className,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[direction]} ${className || ''}`}
            disabled={disabled}
            aria-label={`Скролл ${direction === 'left' ? 'влево' : 'вправо'}`}
            {...props}
        >
            <ChevronIcon className={styles.icon} />
        </button>
    );
};