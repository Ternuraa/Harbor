import React from 'react';
import type { InfoPageContent } from '../../../i18n/types';
import styles from './InfoArticleContent.module.scss';

interface InfoArticleContentProps {
    content: InfoPageContent;
    variant?: 'page' | 'compact' | 'modal';
    showMeta?: boolean;
}

export const InfoArticleContent: React.FC<InfoArticleContentProps> = ({
    content,
    variant = 'compact',
    showMeta = true,
}) => {
    const rootClass = variant === 'page'
        ? styles.page
        : variant === 'modal'
            ? styles.modal
            : styles.compact;

    return (
        <div className={rootClass}>
            {showMeta && content.meta && (
                <p className={styles.meta}>{content.meta}</p>
            )}

            {content.lead && (
                <p className={styles.lead}>{content.lead}</p>
            )}

            <div className={styles.content}>
                {content.sections.map((section) => (
                    <section key={section.title}>
                        <h3 className={styles.sectionTitle}>{section.title}</h3>

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
        </div>
    );
};
