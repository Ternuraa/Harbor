import React from 'react';
import styles from './FormError.module.scss';

interface FormErrorProps {
    message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
    if (!message) return null;
    return <p className={styles.error} role="alert">{message}</p>;
};
