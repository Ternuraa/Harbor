import React from 'react';
import styles from './Filter.module.scss';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    isLast?: boolean; // Если секция последняя, убираем нижнюю полосу
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, children, isLast }) => {
    return (
        <div className={`${styles.section} ${isLast ? styles.noBorder : ''}`}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.sectionContent}>
                {children}
            </div>
        </div>
    );
};