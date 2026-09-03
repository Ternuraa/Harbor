import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hostEarnImage from '../../assets/images/home/host-earn.webp';
import styles from './ListYourSpacePage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { PROPERTY_TYPE_IDS } from '../../utils/searchFilters';
import { getAuthSession } from '../../utils/authStorage';
import { API_URL } from '../../config/api';
const STEPS_COUNT = 4;

export const ListYourSpacePage: React.FC = () => {
    const navigate = useNavigate();
    const { t, dictionary, tPage } = useTranslation();
    const { user } = useAuth();
    const ha = dictionary.hostApplication;
    const guide = tPage('listYourSpace');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [rooms, setRooms] = useState('');
    const [description, setDescription] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const steps = useMemo(() => {
        if (!guide) return [];
        return guide.sections.slice(0, STEPS_COUNT).map((section) => ({
            title: section.title.replace(/^\d+\.\s*/, ''),
            text: section.paragraphs?.[0] ?? section.list?.[0] ?? '',
        }));
    }, [guide]);

    const helpSection = guide?.sections.find((section) => section.title.includes('помощь') || section.title.toLowerCase().includes('help'));

    useEffect(() => {
        if (!user) return;
        if (user.firstName) setFirstName(user.firstName);
        if (user.lastName) setLastName(user.lastName);
        if (user.email) setEmail(user.email);
    }, [user]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedCity = city.trim();
        const trimmedDescription = description.trim();

        if (
            !trimmedFirstName
            || !trimmedLastName
            || !trimmedEmail
            || !trimmedPhone
            || !trimmedCity
            || !propertyType
            || !trimmedDescription
            || !agreeTerms
        ) {
            setError(ha.errorRequired);
            return;
        }

        setIsSubmitting(true);

        try {
            const session = getAuthSession();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (session?.token) {
                headers.Authorization = `Bearer ${session.token}`;
            }

            const response = await fetch(`${API_URL}/host-applications`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    email: trimmedEmail,
                    phone: trimmedPhone,
                    city: trimmedCity,
                    propertyType,
                    rooms: rooms.trim(),
                    description: trimmedDescription,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setError((data as { error?: string }).error || ha.errorServer);
                return;
            }

            setIsSuccess(true);
        } catch {
            setError(ha.errorConnection);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <PageLayout containerClassName={styles.pageCentered}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon} aria-hidden>✓</div>
                    <h1 className={styles.successTitle}>{ha.successTitle}</h1>
                    <p className={styles.successText}>{ha.successText}</p>
                    <Button type="button" onClick={() => navigate('/')}>
                        {ha.backHome}
                    </Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <BackButton className={styles.backButton} onClick={() => navigate(-1)}>
                {t('common.back')}
            </BackButton>

            <div className={styles.layout}>
                <aside className={styles.intro}>
                    <img
                        src={hostEarnImage}
                        alt={dictionary.home.hostEarnAlt}
                        className={styles.heroImage}
                    />

                    <header className={styles.header}>
                        <h1 className={styles.title}>{ha.title}</h1>
                        <p className={styles.meta}>{ha.meta}</p>
                        <p className={styles.lead}>{ha.lead}</p>
                    </header>

                    {steps.length > 0 && (
                        <div className={styles.stepsCard}>
                            <h2 className={styles.stepsTitle}>{ha.stepsTitle}</h2>
                            <ol className={styles.stepsList}>
                                {steps.map((step, index) => (
                                    <li key={step.title} className={styles.stepItem}>
                                        <span className={styles.stepNumber}>{index + 1}</span>
                                        <div className={styles.stepContent}>
                                            <p className={styles.stepTitle}>{step.title}</p>
                                            <p className={styles.stepText}>{step.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {helpSection && (
                        <div className={styles.helpBox}>
                            <strong>{helpSection.title}</strong>
                            <a href="mailto:hosts@harbor.ru">hosts@harbor.ru</a>
                        </div>
                    )}
                </aside>

                <div className={styles.formColumn}>
                    <div className={styles.formCard}>
                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-first-name">{ha.firstName}</label>
                                    <Input
                                        id="host-first-name"
                                        type="text"
                                        name="firstName"
                                        value={firstName}
                                        autoComplete="given-name"
                                        disabled={isSubmitting}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-last-name">{ha.lastName}</label>
                                    <Input
                                        id="host-last-name"
                                        type="text"
                                        name="lastName"
                                        value={lastName}
                                        autoComplete="family-name"
                                        disabled={isSubmitting}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-email">{ha.email}</label>
                                    <Input
                                        id="host-email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        autoComplete="email"
                                        disabled={isSubmitting}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-phone">{ha.phone}</label>
                                    <Input
                                        id="host-phone"
                                        type="tel"
                                        name="phone"
                                        placeholder={ha.phonePlaceholder}
                                        value={phone}
                                        autoComplete="tel"
                                        disabled={isSubmitting}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-city">{ha.city}</label>
                                    <Input
                                        id="host-city"
                                        type="text"
                                        name="city"
                                        placeholder={ha.cityPlaceholder}
                                        value={city}
                                        disabled={isSubmitting}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="host-property-type">{ha.propertyType}</label>
                                    <select
                                        id="host-property-type"
                                        className={styles.select}
                                        value={propertyType}
                                        disabled={isSubmitting}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                    >
                                        <option value="">{ha.propertyTypePlaceholder}</option>
                                        {PROPERTY_TYPE_IDS.map((typeId) => (
                                            <option key={typeId} value={typeId}>
                                                {dictionary.filters.propertyTypes[typeId]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="host-rooms">{ha.rooms}</label>
                                <Input
                                    id="host-rooms"
                                    type="text"
                                    name="rooms"
                                    placeholder={ha.roomsPlaceholder}
                                    value={rooms}
                                    disabled={isSubmitting}
                                    onChange={(e) => setRooms(e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="host-description">{ha.description}</label>
                                <textarea
                                    id="host-description"
                                    className={styles.textarea}
                                    name="description"
                                    placeholder={ha.descriptionPlaceholder}
                                    value={description}
                                    disabled={isSubmitting}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <label className={styles.termsLabel}>
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    disabled={isSubmitting}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span>{ha.agreeTerms}</span>
                            </label>

                            {error && <p className={styles.error}>{error}</p>}

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? ha.submitting : ha.submit}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
