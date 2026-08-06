import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './UserMenu.module.scss';
import burgerIcon from '../../ui/icons/Burger.svg';
import userIcon from '../../ui/icons/User.svg';
import heartIcon from '../../ui/icons/Heart.svg';
// import earthIcon from '../../ui/icons/Earth.svg';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { UserAvatar } from '../../ui/UserAvatar/UserAvatar';

// const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
//     { code: 'ru', label: 'Русский' },
//     { code: 'en', label: 'English' },
// ];

interface MenuLinkProps {
    to: string;
    children: React.ReactNode;
    onNavigate: () => void;
    bold?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, children, onNavigate, bold }) => (
    <li>
        <Link
            to={to}
            className={styles.menuItem}
            onClick={onNavigate}
            style={bold ? { fontWeight: 600 } : undefined}
        >
            {children}
        </Link>
    </li>
);

interface UserMenuProps {
    onOpenSearch?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenSearch }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user, avatarUrl, logout } = useAuth();
    const { count: favoritesCount } = useFavorites();
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    // const [isLangOpen, setIsLangOpen] = useState(false);

    const menuBtnRef = useRef<HTMLButtonElement>(null);
    // const langBtnRef = useRef<HTMLButtonElement>(null);
    const menuDropdownRef = useRef<HTMLDivElement>(null);
    // const langDropdownRef = useRef<HTMLDivElement>(null);

    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    // const [langPosition, setLangPosition] = useState({ top: 0, right: 0 });

    const computePosition = useCallback((btn: HTMLElement | null) => {
        if (!btn) return { top: 0, right: 0 };
        const rect = btn.getBoundingClientRect();
        return {
            top: rect.bottom + 12,
            right: Math.max(window.innerWidth - rect.right, 0),
        };
    }, []);

    useLayoutEffect(() => {
        if (isOpen) setMenuPosition(computePosition(menuBtnRef.current));
    }, [isOpen, computePosition]);

    // useLayoutEffect(() => {
    //     if (isLangOpen) setLangPosition(computePosition(langBtnRef.current));
    // }, [isLangOpen, computePosition]);

    useEffect(() => {
        if (!isOpen) return;

        const updatePositions = () => {
            if (isOpen) setMenuPosition(computePosition(menuBtnRef.current));
            // if (isLangOpen) setLangPosition(computePosition(langBtnRef.current));
        };

        window.addEventListener('scroll', updatePositions, true);
        window.addEventListener('resize', updatePositions);
        return () => {
            window.removeEventListener('scroll', updatePositions, true);
            window.removeEventListener('resize', updatePositions);
        };
    }, [isOpen, computePosition]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideMenu = menuBtnRef.current?.contains(target) || menuDropdownRef.current?.contains(target);
            // const insideLang = langBtnRef.current?.contains(target) || langDropdownRef.current?.contains(target);

            if (!insideMenu) setIsOpen(false);
            // if (!insideLang) setIsLangOpen(false);
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const firstLetter = user?.firstName ? user.firstName.charAt(0).toUpperCase() : '';

    const closeMenu = () => setIsOpen(false);

    const handleFavoritesClick = () => {
        if (isAuthenticated) {
            navigate('/favorites');
            return;
        }
        navigate('/login?redirect=/favorites');
    };

    // const handleLanguageSelect = (code: Language) => {
    //     setLanguage(code);
    //     setIsLangOpen(false);
    // };

    const handleLogout = () => {
        closeMenu();
        logout();
        navigate('/');
    };

    const handleSearchClick = () => {
        closeMenu();
        onOpenSearch?.();
    };

    return (
        <div className={styles.userMenu}>
            <div className={styles.iconButtons}>
                {/* Кнопка смены языка временно отключена
                <div className={styles.dropdownContainer}>
                    <button
                        ref={langBtnRef}
                        className={styles.iconBtn}
                        aria-label={t('userMenu.language')}
                        onClick={() => {
                            setIsLangOpen(!isLangOpen);
                            setIsOpen(false);
                        }}
                    >
                        <img src={earthIcon} alt="" className={styles.icon} />
                    </button>

                    {isLangOpen && createPortal(
                        <div
                            ref={langDropdownRef}
                            className={styles.dropdown}
                            style={{ top: langPosition.top, right: langPosition.right }}
                        >
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
                        </div>,
                        document.body
                    )}
                </div>
                */}

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
                    onClick={() => navigate(isAuthenticated ? '/profile' : '/login?redirect=/profile')}
                >
                    {isAuthenticated && firstLetter ? (
                        <UserAvatar
                            firstName={user?.firstName}
                            avatarUrl={avatarUrl}
                            size="sm"
                            className={styles.userAvatar}
                        />
                    ) : (
                        <img src={userIcon} alt="" className={styles.icon} />
                    )}
                </button>

                <div className={styles.dropdownContainer}>
                    <button
                        ref={menuBtnRef}
                        className={styles.iconBtn}
                        aria-label={t('userMenu.menu')}
                        onClick={() => {
                            setIsOpen(!isOpen);
                            // setIsLangOpen(false);
                        }}
                    >
                        <img src={burgerIcon} alt="" className={styles.icon} />
                    </button>

                    {isOpen && createPortal(
                        <div
                            ref={menuDropdownRef}
                            className={styles.dropdown}
                            style={{ top: menuPosition.top, right: menuPosition.right }}
                        >
                            <ul className={styles.menuList}>
                                <MenuLink to="/" onNavigate={closeMenu}>{t('userMenu.home')}</MenuLink>
                                <li>
                                    <button type="button" className={styles.menuItem} onClick={handleSearchClick}>
                                        {t('userMenu.search')}
                                    </button>
                                </li>
                                <MenuLink to="/favorites" onNavigate={closeMenu}>{t('userMenu.favorites')}</MenuLink>

                                {isAuthenticated ? (
                                    <>
                                        <li className={styles.divider} aria-hidden="true" />
                                        <MenuLink to="/profile" onNavigate={closeMenu}>
                                            {t('userMenu.profile')}
                                        </MenuLink>
                                        <li className={styles.divider} aria-hidden="true" />
                                        <MenuLink to="/list-your-space" onNavigate={closeMenu}>
                                            {t('userMenu.listProperty')}
                                        </MenuLink>
                                        <li className={styles.divider} aria-hidden="true" />
                                        <li>
                                            <button type="button" className={styles.menuItem} onClick={handleLogout}>
                                                {t('userMenu.logout')}
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className={styles.divider} aria-hidden="true" />
                                        <MenuLink to="/login" onNavigate={closeMenu}>
                                            {t('userMenu.login')}
                                        </MenuLink>
                                        <MenuLink to="/register" onNavigate={closeMenu} bold>
                                            {t('userMenu.register')}
                                        </MenuLink>
                                        <li className={styles.divider} aria-hidden="true" />
                                        <MenuLink to="/list-your-space" onNavigate={closeMenu}>
                                            {t('userMenu.listProperty')}
                                        </MenuLink>
                                    </>
                                )}
                            </ul>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        </div>
    );
};
