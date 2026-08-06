import React from 'react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import styles from '../PrivacyPage/PrivacyPage.module.scss';
import articleStyles from './NewsPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { useTranslation } from '../../i18n/useTranslation';

export const NewsArticlePage: React.FC = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { t, tNewsBySlug, dictionary } = useTranslation();

    if (!slug) {
        return <Navigate to="/news" replace />;
    }

    const article = tNewsBySlug(slug);

    if (!article) {
        return <Navigate to="/news" replace />;
    }

    return (
        <PageLayout container="narrow">
            <BackButton className={styles.backButton} onClick={() => navigate(-1)}>
                {t('common.back')}
            </BackButton>

            <article className={styles.article}>
                <header className={styles.pageHeader}>
                    <time className={articleStyles.date} dateTime={article.date}>{article.date}</time>
                    <h1 className={styles.title}>{article.title}</h1>
                </header>

                <p className={styles.lead}>{article.excerpt}</p>

                <div className={styles.content}>
                    <section>
                        {article.paragraphs.map((text) => (
                            <p key={text} className={styles.paragraph}>{text}</p>
                        ))}
                    </section>
                </div>

                <Link to="/news" className={articleStyles.backToNews}>
                    {dictionary.news.backToNews}
                </Link>
            </article>
        </PageLayout>
    );
};
