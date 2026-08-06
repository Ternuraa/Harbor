import React from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'md' | 'sm';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    onClick,
    className,
    disabled,
    variant = 'primary',
    size = 'md',
    fullWidth = true,
}) => {
    return (
        <button
            type={type}
            className={[
                styles.button,
                styles[variant],
                styles[size],
                fullWidth ? styles.fullWidth : '',
                className || '',
            ].filter(Boolean).join(' ')}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
