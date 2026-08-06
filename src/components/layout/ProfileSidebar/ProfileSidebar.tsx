import React from 'react';
import styles from './ProfileSidebar.module.scss';
import { UserAvatar } from '../../ui/UserAvatar/UserAvatar';
import { useAuth } from '../../../context/AuthContext';
import { ProfileNavItem } from './ProfileNavItem';
import { useTranslation } from '../../../i18n/useTranslation';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onAvatarClick?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    activeTab,
    onTabChange,
    onAvatarClick,
}) => {
    const { user, avatarUrl } = useAuth();
    const { t, dictionary } = useTranslation();
    const profile = dictionary.profile;

    const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : profile.defaultName;

    const registrationYear = user?.registrationYear || new Date().getFullYear();

    const menuItems = [
        { id: 'trips', label: profile.nav.trips },
        { id: 'past-trips', label: profile.nav.pastTrips },
        { id: 'personal', label: profile.nav.personal },
        { id: 'payments', label: profile.nav.payments },
        { id: 'security', label: profile.nav.security },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.userCard}>
                <UserAvatar
                    firstName={user?.firstName}
                    avatarUrl={avatarUrl}
                    size="md"
                    editable
                    editLabel={profile.personal.changePhoto}
                    onClick={onAvatarClick}
                    ariaLabel={profile.personal.editPhotoAria}
                />
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
