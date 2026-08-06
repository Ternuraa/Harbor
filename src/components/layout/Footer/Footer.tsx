import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.sections}>
                    <div className={styles.section}>
                        <h3>{t('footer.support')}</h3>
                        <ul>
                            <li>
                                <Link to="/cancellation-policy" className={styles.sectionLink}>
                                    {t('footer.cancellation')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/guest-safety" className={styles.sectionLink}>
                                    {t('footer.guestSafety')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className={styles.sectionLink}>
                                    {t('footer.contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h3>{t('footer.hosts')}</h3>
                        <ul>
                            <li>
                                <Link to="/list-your-space" className={styles.sectionLink}>
                                    {t('footer.listYourSpace')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/host-protection" className={styles.sectionLink}>
                                    {t('footer.hostProtection')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/host-resources" className={styles.sectionLink}>
                                    {t('footer.hostResources')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h3>{t('footer.harbor')}</h3>
                        <ul>
                            <li>
                                <Link to="/about" className={styles.sectionLink}>
                                    {t('footer.about')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className={styles.sectionLink}>
                                    {t('footer.news')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p>{t('footer.copyright')}</p>
                    <div className={styles.links}>
                        <Link to="/terms" className={styles.footerLink}>{t('footer.terms')}</Link>
                        <Link to="/privacy" className={styles.footerLink}>{t('footer.privacy')}</Link>
                        <Link to="/sitemap" className={styles.footerLink}>{t('footer.sitemap')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
