import React from 'react';
import { useNavigate } from 'react-router-dom';
import hostEarnImage from '../../../assets/images/home/host-earn.webp';
import styles from './HostEarnBanner.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';

export const HostEarnBanner: React.FC = () => {
    const navigate = useNavigate();
    const { dictionary } = useTranslation();
    const home = dictionary.home;

    return (
        <section className={styles.section}>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{home.hostEarnTitle}</h2>
                    <p className={styles.incomeLabel}>{home.hostEarnLabel}</p>
                    <p className={styles.incomeValue}>{home.hostEarnValue}</p>
                    <button
                        type="button"
                        className={styles.cta}
                        onClick={() => navigate('/list-your-space')}
                    >
                        {home.hostEarnCta}
                    </button>
                </div>
                <div className={styles.imageWrap}>
                    <img
                        src={hostEarnImage}
                        alt={home.hostEarnAlt}
                        className={styles.image}
                    />
                    <div className={styles.imageGradient} aria-hidden="true" />
                </div>
            </div>
        </section>
    );
};
