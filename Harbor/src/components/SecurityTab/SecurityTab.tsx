import React, { useState } from 'react';
import styles from './SecurityTab.module.scss';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { EyeIcon } from '../ui/icons/EyeIcon';
import { EyeOffIcon } from '../ui/icons/EyeOffIcon';
import { useTranslation } from '../../i18n/useTranslation';

export const SecurityTab: React.FC = () => {
    const { dictionary } = useTranslation();
    const labels = dictionary.profile.security;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const isLong = newPassword.length >= 8;
    const hasNum = /\d/.test(newPassword);
    const isMatch = newPassword === confirmPassword;
    const isSameAsCurrent = currentPassword !== '' && newPassword !== '' && currentPassword === newPassword;
    const showMismatchError = confirmPassword.length > 0 && !isMatch;
    const isValid = isLong && hasNum && isMatch && currentPassword !== '' && !isSameAsCurrent;

    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdatePassword = async () => {
        if (!isValid) return;
        setIsUpdating(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert(labels.successAlert);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswords({ current: false, new: false, confirm: false });
        } catch {
            alert(labels.errorAlert);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>{labels.title}</h1>

            <div className={styles.cardBlock}>
                <div className={styles.cardHeader}>
                    <h3>{labels.passwordTitle}</h3>
                </div>
                <p className={styles.descriptionText}>{labels.description}</p>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{labels.currentPassword}</label>
                    <div className={styles.passwordWrapper}>
                        <Input
                            type={showPasswords.current ? 'text' : 'password'}
                            placeholder={labels.currentPasswordPlaceholder}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button type="button" className={styles.eyeButton} onClick={() => toggleVisibility('current')}>
                            {showPasswords.current ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{labels.newPassword}</label>
                    <div className={styles.passwordWrapper}>
                        <Input
                            type={showPasswords.new ? 'text' : 'password'}
                            placeholder={labels.newPasswordPlaceholder}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button type="button" className={styles.eyeButton} onClick={() => toggleVisibility('new')}>
                            {showPasswords.new ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {isSameAsCurrent && (
                        <span className={styles.errorText}>{labels.sameAsCurrentError}</span>
                    )}

                    <ul className={styles.passwordReqs}>
                        <li className={isLong ? styles.valid : ''}>{labels.minLength}</li>
                        <li className={hasNum ? styles.valid : ''}>{labels.hasNumber}</li>
                    </ul>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{labels.confirmPassword}</label>
                    <div className={styles.passwordWrapper}>
                        <Input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            placeholder={labels.confirmPasswordPlaceholder}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="button" className={styles.eyeButton} onClick={() => toggleVisibility('confirm')}>
                            {showPasswords.confirm ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {showMismatchError && (
                        <span className={styles.errorText}>{labels.mismatchError}</span>
                    )}
                </div>

                <div style={{ marginTop: '24px' }}>
                    <Button disabled={!isValid || isUpdating} onClick={handleUpdatePassword}>
                        {isUpdating ? labels.updating : labels.update}
                    </Button>
                </div>
            </div>
        </div>
    );
};
