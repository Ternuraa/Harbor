import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './FavoritesModal.module.scss';
import { Button } from '../Button/Button';
import { useFavorites } from '../../../context/FavoritesContext';
import { getRememberedEmail } from '../../../utils/authStorage';
import { maskEmail } from '../../../utils/maskEmail';
import { useTranslation } from '../../../i18n/useTranslation';

const AVATAR_COLORS = [
    { bg: '#EAE6FF', text: '#5D44D5' },
    { bg: '#FFEAEA', text: '#D54444' },
    { bg: '#EAFFEB', text: '#3EAF4A' },
    { bg: '#EAF6FF', text: '#2B86C5' },
    { bg: '#FFF5EA', text: '#D58D44' },
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

export const FavoritesModal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { modal, closeModal } = useFavorites();
    const { t } = useTranslation();

    const rememberedEmail = getRememberedEmail();
    const redirect = encodeURIComponent(location.pathname + location.search);

    useEffect(() => {
        if (!modal.isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeModal();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [modal.isOpen, closeModal]);

    if (!modal.isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) closeModal();
    };

    const avatarLetter = rememberedEmail.charAt(0).toUpperCase() || 'H';
    const avatarStyle = getAvatarColor(rememberedEmail || 'Харбор');

    return (
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="favorites-modal-title">
                <button
                    type="button"
                    className={styles.closeBtn}
                    aria-label={t('favoritesModal.close')}
                    onClick={closeModal}
                >
                    ×
                </button>

                <div className={styles.content}>
                    <div
                        className={styles.avatar}
                        style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
                    >
                        {avatarLetter}
                    </div>

                    <h2 id="favorites-modal-title" className={styles.title}>
                        {rememberedEmail ? t('favoritesModal.welcomeBack') : t('favoritesModal.saveThisPlace')}
                    </h2>

                    {rememberedEmail && (
                        <div className={styles.emailRow}>
                            <span className={styles.emailIcon} aria-hidden="true">✉</span>
                            <span>{maskEmail(rememberedEmail)}</span>
                        </div>
                    )}

                    <p className={styles.subtitle}>
                        {t('favoritesModal.loginPrompt')}
                    </p>

                    <div className={styles.actions}>
                        <Button onClick={() => {
                            closeModal();
                            navigate(`/login?redirect=${redirect}`);
                        }}>
                            {t('favoritesModal.login')}
                        </Button>
                        <Link
                            to={`/register?redirect=${redirect}`}
                            className={styles.secondaryLink}
                            onClick={closeModal}
                        >
                            {t('favoritesModal.register')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
