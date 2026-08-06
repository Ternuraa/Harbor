import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
    disabled?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    onClick,
    className,
    disabled 
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${className || ''}`}
            onClick={onClick}
            disabled={disabled} 
        >
            {children}
        </button>
    );
};