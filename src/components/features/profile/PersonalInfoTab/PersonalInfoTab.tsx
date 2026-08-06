import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PersonalInfoTab.module.scss';
import { Input } from '../../../ui/Input/Input';
import { Button } from '../../../ui/Button/Button';
import { UserAvatar } from '../../../ui/UserAvatar/UserAvatar';
import { useTranslation } from '../../../../i18n/useTranslation';
import { useAuth } from '../../../../context/AuthContext';

interface PersonalInfoTabProps {
    requestAvatarUpload?: boolean;
    onAvatarUploadHandled?: () => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
    requestAvatarUpload = false,
    onAvatarUploadHandled,
}) => {
    const { dictionary } = useTranslation();
    const labels = dictionary.profile.personal;
    const { user, avatarUrl, updateUser, setAvatarFromFile, removeAvatar } = useAuth();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarSectionRef = useRef<HTMLDivElement>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    useEffect(() => {
        if (!user) return;
        setFirstName(user.firstName);
        setLastName(user.lastName ?? '');
        setPhone(user.phone ?? '');
    }, [user]);

    const openFilePicker = useCallback(() => {
        setAvatarError('');
        fileInputRef.current?.click();
    }, []);

    useEffect(() => {
        if (!requestAvatarUpload) return;

        avatarSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const timer = window.setTimeout(() => {
            openFilePicker();
            onAvatarUploadHandled?.();
        }, 250);

        return () => window.clearTimeout(timer);
    }, [requestAvatarUpload, openFilePicker, onAvatarUploadHandled]);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        setAvatarError('');
        setIsUploadingAvatar(true);

        try {
            await setAvatarFromFile(file);
        } catch (error) {
            const code = error instanceof Error ? error.message : 'unknown';

            if (code === 'invalid_type') {
                setAvatarError(labels.avatarInvalidType);
            } else if (code === 'too_large') {
                setAvatarError(labels.avatarTooLarge);
            } else {
                setAvatarError(labels.avatarSaveError);
            }
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarError('');
        removeAvatar();
    };

    const handleSaveChanges = (event: React.FormEvent) => {
        event.preventDefault();

        updateUser({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
        });

        alert(labels.savedAlert);
    };

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>{labels.title}</h1>

            <div className={styles.cardBlock}>
                <div ref={avatarSectionRef} className={styles.avatarSection}>
                    <UserAvatar
                        firstName={user?.firstName}
                        avatarUrl={avatarUrl}
                        size="lg"
                    />

                    <div className={styles.avatarControls}>
                        <p className={styles.avatarTitle}>{labels.avatarTitle}</p>
                        <p className={styles.avatarHint}>{labels.avatarHint}</p>

                        <div className={styles.avatarActions}>
                            <Button
                                type="button"
                                onClick={openFilePicker}
                                disabled={isUploadingAvatar}
                            >
                                {labels.changePhoto}
                            </Button>

                            {avatarUrl && (
                                <button
                                    type="button"
                                    className={styles.removePhotoButton}
                                    onClick={handleRemoveAvatar}
                                    disabled={isUploadingAvatar}
                                >
                                    {labels.removePhoto}
                                </button>
                            )}
                        </div>

                        {avatarError && (
                            <p className={styles.avatarError} role="alert">
                                {avatarError}
                            </p>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className={styles.hiddenFileInput}
                        onChange={handleAvatarChange}
                    />
                </div>

                <form onSubmit={handleSaveChanges}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{labels.firstName}</label>
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{labels.lastName}</label>
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{labels.email}</label>
                        <Input
                            type="email"
                            value={user?.email ?? ''}
                            readOnly
                        />
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
                        <label className={styles.label}>{labels.phone}</label>
                        <Input
                            type="tel"
                            placeholder={labels.phonePlaceholder}
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Button type="submit">{labels.save}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
