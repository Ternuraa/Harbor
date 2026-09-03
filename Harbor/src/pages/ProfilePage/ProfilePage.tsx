import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { ProfileSidebar } from '../../components/layout/ProfileSidebar/ProfileSidebar';
import { PersonalInfoTab } from '../../components/features/profile/PersonalInfoTab/PersonalInfoTab';
import { PaymentsTab } from '../../components/features/profile/PaymentsTab/PaymentsTab';
import { TripsTab } from '../../components/features/profile/TripsTab/TripsTab';
import { SecurityTab } from '../../components/features/profile/SecurityTab/SecurityTab';
import { useAuth } from '../../context/AuthContext';

const PROFILE_TABS = ['trips', 'past-trips', 'personal', 'payments', 'security'] as const;

const isProfileTab = (value: string | null): value is typeof PROFILE_TABS[number] =>
    value !== null && PROFILE_TABS.includes(value as typeof PROFILE_TABS[number]);

const resolveInitialTab = (tabFromUrl: string | null): string => {
    if (isProfileTab(tabFromUrl)) return tabFromUrl;

    const saved = localStorage.getItem('profileActiveTab');
    if (saved === 'notifications') return 'personal';
    if (isProfileTab(saved)) return saved;

    return 'personal';
};

export const ProfilePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(() => resolveInitialTab(tabFromUrl));
    const [requestAvatarUpload, setRequestAvatarUpload] = useState(false);

    useEffect(() => {
        if (isProfileTab(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    useEffect(() => {
        localStorage.setItem('profileActiveTab', activeTab);
    }, [activeTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchParams({ tab }, { replace: true });
    };

    const handleAvatarClick = () => {
        handleTabChange('personal');
        setRequestAvatarUpload(true);
    };

    if (!isAuthenticated) {
        return <Navigate to="/login?redirect=/profile" replace />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'trips': return <TripsTab variant="upcoming" />;
            case 'past-trips': return <TripsTab variant="past" />;
            case 'personal':
                return (
                    <PersonalInfoTab
                        requestAvatarUpload={requestAvatarUpload}
                        onAvatarUploadHandled={() => setRequestAvatarUpload(false)}
                    />
                );
            case 'payments': return <PaymentsTab />;
            case 'security': return <SecurityTab />;
            default:
                return (
                    <PersonalInfoTab
                        requestAvatarUpload={requestAvatarUpload}
                        onAvatarUploadHandled={() => setRequestAvatarUpload(false)}
                    />
                );
        }
    };

    return (
        <PageLayout containerClassName={styles.layout}>
            <ProfileSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onAvatarClick={handleAvatarClick}
            />
            <div className={styles.content}>{renderContent()}</div>
        </PageLayout>
    );
};
