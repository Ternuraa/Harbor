import React from 'react';
import styles from './CardBlock.module.scss';

interface CardBlockProps {
    title?: string;
    actionText?: string;
    onAction?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const CardBlock: React.FC<CardBlockProps> = ({ title, actionText, onAction, children, className }) => {
    return (
        <div className={`${styles.cardBlock} ${className || ''}`}>
            {(title || actionText) && (
                <div className={styles.header}>
                    {title && <h3>{title}</h3>}
                    {actionText && (
                        <button className={styles.btnText} onClick={onAction}>
                            {actionText}
                        </button>
                    )}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};