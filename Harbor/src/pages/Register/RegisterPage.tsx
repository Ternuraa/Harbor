import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getRememberMePreference,
    setRememberedEmail,
    setRememberMePreference,
} from '../../utils/authStorage';
import { AuthLayout } from '../../components/layout/AuthLayout/AuthLayout';
import { FormField } from '../../components/ui/FormField/FormField';
import { FormError } from '../../components/ui/FormError/FormError';
import { Input } from '../../components/ui/Input/Input';
import { PasswordInput } from '../../components/ui/PasswordInput/PasswordInput';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { API_URL } from '../../config/api';
import { readApiJson, getApiErrorMessage } from '../../utils/apiError';
import authFormStyles from '../../components/features/auth/AuthForm/AuthForm.module.scss';
import layoutStyles from '../../components/layout/AuthLayout/AuthLayout.module.scss';

const MIN_PASSWORD_LENGTH = 6;

const sanitizeRedirect = (path: string | null) => {
    if (!path || !path.startsWith('/') || path.startsWith('//')) return '/';
    return path;
};

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const { t } = useTranslation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const redirectPath = sanitizeRedirect(searchParams.get('redirect'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();

        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password) {
            setError(t('auth.fillAllFields'));
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(t('auth.passwordTooShort'));
            return;
        }

        if (!agreeTerms) {
            setError(t('auth.agreeTermsRequired'));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    email: trimmedEmail,
                    password,
                }),
            });

            const data = await readApiJson<{
                error?: string;
                token?: string;
                user?: {
                    id: number;
                    firstName: string;
                    lastName: string;
                    email: string;
                };
            }>(response);

            if (!response.ok) {
                setError(getApiErrorMessage(response, data, {
                    connectionError: t('auth.connectionError'),
                    serverError: t('auth.serverError'),
                    fallback: t('auth.registerFailed'),
                }));
                return;
            }

            if (!data?.token || !data.user) {
                setError(t('auth.connectionError'));
                return;
            }

            const remember = getRememberMePreference();
            setRememberMePreference(remember);

            if (remember) {
                setRememberedEmail(trimmedEmail);
            }

            login(data.token, data.user, remember);
            navigate(redirectPath, { replace: true });
        } catch {
            setError(t('auth.connectionError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const loginLink = redirectPath !== '/'
        ? `/login?redirect=${encodeURIComponent(redirectPath)}`
        : '/login';

    return (
        <AuthLayout
            title={t('auth.registerTitle')}
            subtitle={t('auth.registerSubtitle')}
            imageAlt={t('auth.registerTitle')}
            footerPrompt={t('auth.haveAccount')}
            footerLink={(
                <Link to={loginLink} className={layoutStyles.footerLink}>
                    {t('auth.signIn')}
                </Link>
            )}
        >
            <form className={authFormStyles.form} onSubmit={handleSubmit} noValidate>
                <div className={authFormStyles.nameRow}>
                    <FormField label={t('auth.firstName')} htmlFor="register-first-name">
                        <Input
                            id="register-first-name"
                            type="text"
                            name="firstName"
                            placeholder={t('auth.firstName')}
                            value={firstName}
                            autoComplete="given-name"
                            disabled={isSubmitting}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                        />
                    </FormField>
                    <FormField label={t('auth.lastName')} htmlFor="register-last-name">
                        <Input
                            id="register-last-name"
                            type="text"
                            name="lastName"
                            placeholder={t('auth.lastName')}
                            value={lastName}
                            autoComplete="family-name"
                            disabled={isSubmitting}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                        />
                    </FormField>
                </div>

                <FormField label={t('auth.email')} htmlFor="register-email">
                    <Input
                        id="register-email"
                        type="email"
                        name="email"
                        placeholder={t('auth.email')}
                        value={email}
                        autoComplete="email"
                        disabled={isSubmitting}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                </FormField>

                <FormField label={t('auth.password')} htmlFor="register-password">
                    <PasswordInput
                        id="register-password"
                        name="password"
                        placeholder={t('auth.createPassword')}
                        value={password}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </FormField>

                <FormError message={error} />

                <div className={authFormStyles.optionsColumn}>
                    <label className={authFormStyles.termsLabel}>
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            disabled={isSubmitting}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <span>
                            {t('auth.agreeTermsPrefix')}{' '}
                            <Link to="/terms" className={authFormStyles.link}>{t('sitemap.links.terms')}</Link>
                            {' '}{t('auth.agreeTermsAnd')}{' '}
                            <Link to="/privacy" className={authFormStyles.link}>{t('sitemap.links.privacy')}</Link>
                        </span>
                    </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className={authFormStyles.submitBtn}>
                    {isSubmitting ? t('auth.registering') : t('auth.register')}
                </Button>
            </form>
        </AuthLayout>
    );
};
