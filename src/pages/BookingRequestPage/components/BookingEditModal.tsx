import React, { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './BookingEditModal.module.scss';

interface BookingEditModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSave?: () => void;
    saveLabel?: string;
    onClear?: () => void;
    clearLabel?: string;
    cancelLabel?: string;
    wide?: boolean;
    mode?: 'form' | 'info';
    children: ReactNode;
}

export const BookingEditModal: React.FC<BookingEditModalProps> = ({
    isOpen,
    title,
    onClose,
    onSave,
    saveLabel,
    onClear,
    clearLabel,
    cancelLabel,
    wide = false,
    mode = 'form',
    children,
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
            <div
                className={[
                    styles.modal,
                    wide && styles.modalWide,
                    mode === 'info' && styles.modalInfo,
                ].filter(Boolean).join(' ')}
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-edit-modal-title"
            >
                <div className={styles.header}>
                    <h2 id="booking-edit-modal-title" className={styles.title}>{title}</h2>
                    <button type="button" className={styles.closeBtn} aria-label={cancelLabel} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={`${styles.body} ${mode === 'info' ? styles.bodyInfo : ''}`.trim()}>
                    {children}
                </div>

                {mode === 'info' ? (
                    <div className={styles.footerInfo}>
                        <button type="button" className={styles.saveBtn} onClick={onClose}>
                            {saveLabel}
                        </button>
                    </div>
                ) : (
                    <div className={styles.footer}>
                        {onClear && clearLabel ? (
                            <button type="button" className={styles.textAction} onClick={onClear}>
                                {clearLabel}
                            </button>
                        ) : cancelLabel ? (
                            <button type="button" className={styles.textAction} onClick={onClose}>
                                {cancelLabel}
                            </button>
                        ) : (
                            <span />
                        )}
                        <button type="button" className={styles.saveBtn} onClick={onSave}>
                            {saveLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};
