import React, { useState } from 'react';
import styles from './PersonalInfoTab.module.scss';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { useTranslation } from '../../i18n/useTranslation';

export const PersonalInfoTab: React.FC = () => {
    const { dictionary } = useTranslation();
    const labels = dictionary.profile.personal;

    const [firstName, setFirstName] = useState('Elizaveta');
    const [lastName, setLastName] = useState('Savelieva');
    const [email, setEmail] = useState('lisasavelieva46@gmail.com');
    const [phone, setPhone] = useState('');

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        alert(labels.savedAlert);
    };

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>{labels.title}</h1>

            <div className={styles.cardBlock}>
                <form onSubmit={handleSaveChanges}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{labels.firstName}</label>
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{labels.lastName}</label>
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{labels.email}</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
                        <label className={styles.label}>{labels.phone}</label>
                        <Input
                            type="tel"
                            placeholder={labels.phonePlaceholder}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
