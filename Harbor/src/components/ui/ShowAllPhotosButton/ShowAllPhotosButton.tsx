import React from 'react';
import styles from './ShowAllPhotosButton.module.scss';

interface ShowAllPhotosButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export const ShowAllPhotosButton: React.FC<ShowAllPhotosButtonProps> = ({
    onClick,
    children,
}) => (
    <button type="button" className={styles.button} onClick={onClick}>
        {children}
    </button>
);
