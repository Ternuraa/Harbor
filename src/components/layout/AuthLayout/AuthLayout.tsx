import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.scss';
import { AUTH_HERO_IMAGE } from './constants';

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    imageAlt: string;
    imageSrc?: string;
    footerPrompt: string;
    footerLink: React.ReactNode;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    imageAlt,
    imageSrc = AUTH_HERO_IMAGE,
    footerPrompt,
    footerLink,
    children,
}) => (
    <main id="main-content" className={styles.page}>
        <div className={styles.imageBlock}>
            <img src={imageSrc} alt={imageAlt} className={styles.heroImage} />
        </div>

        <div className={styles.formBlock}>
            <div className={styles.formContainer}>
                <Link to="/" className={styles.logo}>Харбор</Link>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {children}
                <div className={styles.divider} />
                <p className={styles.footer}>
                    {footerPrompt}
                    {footerLink}
                </p>
            </div>
        </div>
    </main>
);
