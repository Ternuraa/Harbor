import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './UserMenu.module.scss';
import burgerIcon from '../../components/ui/icons/Burger.svg';
import userIcon from '../../components/ui/icons/User.svg';
import heartIcon from '../../components/ui/icons/Heart.svg';
import earthIcon from '../../components/ui/icons/Earth.svg';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { Language } from '../../i18n/types';

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

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
];

export const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { count: favoritesCount } = useFavorites();
    const { t, language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideMenu = menuRef.current?.contains(target);
            const insideLang = langMenuRef.current?.contains(target);
            if (!insideMenu && !insideLang) {
                setIsOpen(false);
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const firstLetter = user?.firstName ? user.firstName.charAt(0).toUpperCase() : '';

    const avatarStyle = useMemo(() => {
        if (!user?.firstName) return {};
        const colors = getAvatarColor(user.firstName);
        return {
            backgroundColor: colors.bg,
            color: colors.text,
        };
    }, [user?.firstName]);

    const handleFavoritesClick = () => {
        if (isAuthenticated) {
            navigate('/favorites');
            return;
        }
        navigate('/login');
    };

    const handleLanguageSelect = (code: Language) => {
        setLanguage(code);
        setIsLangOpen(false);
    };

    return (
        <div className={styles.userMenu}>
            <div className={styles.iconButtons}>
                <div className={styles.dropdownContainer} ref={langMenuRef}>
                    <button
                        className={styles.iconBtn}
                        aria-label={t('userMenu.language')}
                        onClick={() => {
                            setIsLangOpen(!isLangOpen);
                            setIsOpen(false);
                        }}
                    >
                        <img src={earthIcon} alt="" className={styles.icon} />
                    </button>

                    {isLangOpen && (
                        <div className={styles.dropdown}>
                            <ul className={styles.menuList}>
                                {LANGUAGE_OPTIONS.map((option) => (
                                    <li key={option.code}>
                                        <button
                                            type="button"
                                            className={`${styles.menuItem} ${language === option.code ? styles.menuItemActive : ''}`}
                                            onClick={() => handleLanguageSelect(option.code)}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    className={styles.iconBtn}
                    aria-label={t('userMenu.favorites')}
                    onClick={handleFavoritesClick}
                >
                    <img src={heartIcon} alt="" className={styles.icon} />
                    {isAuthenticated && favoritesCount > 0 && (
                        <span className={styles.badge}>{favoritesCount}</span>
                    )}
                </button>
                <button
                    className={styles.iconBtn}
                    aria-label={t('userMenu.profile')}
                    onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                >
                    {isAuthenticated && firstLetter ? (
                        <div className={styles.userAvatar} style={avatarStyle}>
                            {firstLetter}
                        </div>
                    ) : (
                        <img src={userIcon} alt="" className={styles.icon} />
                    )}
                </button>

                <div className={styles.dropdownContainer} ref={menuRef}>
                    <button
                        className={styles.iconBtn}
                        aria-label={t('userMenu.menu')}
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setIsLangOpen(false);
                        }}
                    >
                        <img src={burgerIcon} alt="" className={styles.icon} />
                    </button>

                    {isOpen && (
                        <div className={styles.dropdown}>
                            <ul className={styles.menuList}>
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/favorites" className={styles.menuItem}>{t('userMenu.favorites')}</Link>
                                        <Link to="/trips" className={styles.menuItem}>{t('userMenu.trips')}</Link>
                                        <Link to="/messages" className={styles.menuItem}>{t('userMenu.messages')}</Link>
                                        <div className={styles.divider} />
                                        <Link to="/notifications" className={styles.menuItem}>{t('userMenu.notifications')}</Link>
                                        <Link to="/settings" className={styles.menuItem}>{t('userMenu.settings')}</Link>
                                        <Link to="/help" className={styles.menuItem}>{t('userMenu.helpCenter')}</Link>
                                        <div className={styles.divider} />
                                        <div className={styles.menuItem} onClick={logout}>{t('userMenu.logout')}</div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register" className={styles.menuItem} style={{ fontWeight: 600 }}>
                                            {t('userMenu.register')}
                                        </Link>
                                        <Link to="/login" className={styles.menuItem}>{t('userMenu.login')}</Link>
                                        <div className={styles.divider} />
                                        <Link to="/list-your-space" className={styles.menuItem}>{t('userMenu.listProperty')}</Link>
                                        <Link to="/help" className={styles.menuItem}>{t('userMenu.helpCenter')}</Link>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
