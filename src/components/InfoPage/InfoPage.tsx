import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../pages/PrivacyPage/PrivacyPage.module.scss';
import { PageLayout } from '../layout/PageLayout/PageLayout';
import { BackButton } from '../ui/BackButton/BackButton';
import { useTranslation } from '../../i18n/useTranslation';

type InfoPageProps = {
    pageKey: string;
};

export const InfoPage: React.FC<InfoPageProps> = ({ pageKey }) => {
    const navigate = useNavigate();
    const { t, tPage } = useTranslation();
    const content = tPage(pageKey);

    if (!content) return null;

    return (
        <PageLayout container="narrow">
            <BackButton className={styles.backButton} onClick={() => navigate(-1)}>
                {t('common.back')}
            </BackButton>

            <article className={styles.article}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.title}>{content.title}</h1>
                    <p className={styles.meta}>{content.meta}</p>
                </header>

                <p className={styles.lead}>{content.lead}</p>

                <div className={styles.content}>
                    {content.sections.map((section) => (
                        <section key={section.title}>
                            <h2 className={styles.sectionTitle}>{section.title}</h2>

                            {section.paragraphs?.map((text) => (
                                <p key={text} className={styles.paragraph}>{text}</p>
                            ))}

                            {section.list && (
                                <ul className={styles.list}>
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </article>
        </PageLayout>
    );
};
