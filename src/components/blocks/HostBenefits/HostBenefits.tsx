import React from 'react';
import styles from './HostBenefits.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';

const benefitIcons = {
    protection: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 2L4 5.5V11.5C4 16.42 7.16 20.74 12 22C16.84 20.74 20 16.42 20 11.5V5.5L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    ),
    guests: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M3 20C3 16.13 5.69 14 9 14C12.31 14 15 16.13 15 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M14.5 20C14.5 17.24 16.01 15.5 18 15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    ),
    freedom: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    support: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6.5 4.5C5.12 4.5 4 5.62 4 7V16C4 17.38 5.12 18.5 6.5 18.5H7.5L10 21V18.5H17.5C18.88 18.5 20 17.38 20 16V7C20 5.62 18.88 4.5 17.5 4.5H6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

export const HostBenefits: React.FC = () => {
    const { dictionary } = useTranslation();
    const home = dictionary.home;

    const benefits = [
        {
            id: 'protection',
            title: home.hostBenefitProtectionTitle,
            description: home.hostBenefitProtectionDesc,
            icon: benefitIcons.protection,
        },
        {
            id: 'guests',
            title: home.hostBenefitGuestsTitle,
            description: home.hostBenefitGuestsDesc,
            icon: benefitIcons.guests,
        },
        {
            id: 'freedom',
            title: home.hostBenefitFreedomTitle,
            description: home.hostBenefitFreedomDesc,
            icon: benefitIcons.freedom,
        },
        {
            id: 'support',
            title: home.hostBenefitSupportTitle,
            description: home.hostBenefitSupportDesc,
            icon: benefitIcons.support,
        },
    ];

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{home.hostBenefitsTitle}</h2>
            <div className={styles.grid}>
                {benefits.map((benefit) => (
                    <article key={benefit.id} className={styles.card}>
                        <div className={styles.icon}>{benefit.icon}</div>
                        <h3 className={styles.cardTitle}>{benefit.title}</h3>
                        <p className={styles.cardText}>{benefit.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};
