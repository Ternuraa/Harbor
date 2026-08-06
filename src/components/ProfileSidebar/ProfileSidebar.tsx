import React, { useMemo } from 'react';
import styles from './ProfileSidebar.module.scss';
import { useAuth } from '../../context/AuthContext';
import { ProfileNavItem } from './ProfileNavItem';
import { useTranslation } from '../../i18n/useTranslation';

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

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
    const { user } = useAuth();
    const { t, dictionary } = useTranslation();
    const profile = dictionary.profile;

    const firstLetter = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'E';
    const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : profile.defaultName;

    const registrationYear = user?.registrationYear || new Date().getFullYear();

    const avatarStyle = useMemo(() => {
        if (!user?.firstName) return { backgroundColor: '#EAFFEB', color: '#3EAF4A' };
        const colors = getAvatarColor(user.firstName);
        return {
            backgroundColor: colors.bg,
            color: colors.text,
        };
    }, [user?.firstName]);

    const menuItems = [
        { id: 'trips', label: profile.nav.trips },
        { id: 'personal', label: profile.nav.personal },
        { id: 'payments', label: profile.nav.payments },
        { id: 'security', label: profile.nav.security },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.userCard}>
                <div className={styles.avatar} style={avatarStyle}>
                    {firstLetter}
                </div>
                <div className={styles.userInfo}>
                    <h2>{fullName}</h2>
                    <p>{t('profile.memberSince').replace('{year}', String(registrationYear))}</p>
                </div>
            </div>

            <nav className={styles.navMenu}>
                {menuItems.map((item) => (
                    <ProfileNavItem
                        key={item.id}
                        label={item.label}
                        isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};
