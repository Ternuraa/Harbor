import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import layoutStyles from '../PrivacyPage/PrivacyPage.module.scss';
import styles from './NewsPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { useTranslation } from '../../i18n/useTranslation';

export const NewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, tNewsItems, dictionary } = useTranslation();
    const news = dictionary.news;

    return (
        <PageLayout container="narrow">
            <BackButton className={layoutStyles.backButton} onClick={() => navigate(-1)}>
                {t('common.back')}
            </BackButton>

            <article className={layoutStyles.article}>
                <header className={layoutStyles.pageHeader}>
                    <h1 className={layoutStyles.title}>{news.title}</h1>
                    <p className={layoutStyles.meta}>{news.meta}</p>
                </header>

                <p className={layoutStyles.lead}>{news.lead}</p>

                <div className={layoutStyles.content}>
                    {tNewsItems().map((item) => (
                        <section key={item.slug} className={styles.card}>
                            <time className={styles.date} dateTime={item.date}>{item.date}</time>
                            <h2 className={styles.cardTitle}>
                                <Link to={`/news/${item.slug}`} className={styles.cardLink}>
                                    {item.title}
                                </Link>
                            </h2>
                            <p className={styles.excerpt}>{item.excerpt}</p>
                        </section>
                    ))}
                </div>
            </article>
        </PageLayout>
    );
};
