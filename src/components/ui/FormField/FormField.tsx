import React from 'react';
import clsx from 'clsx';
import styles from './FormField.module.scss';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    htmlFor,
    children,
    className,
}) => (
    <div className={clsx(styles.field, className)}>
        <label className={styles.label} htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
);
