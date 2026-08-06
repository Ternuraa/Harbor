import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    clearRememberedEmail,
    getRememberedEmail,
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
import { readApiJson, getApiErrorMessage, isBackendUnavailable } from '../../utils/apiError';
import authFormStyles from '../../components/features/auth/AuthForm/AuthForm.module.scss';
import layoutStyles from '../../components/layout/AuthLayout/AuthLayout.module.scss';

const sanitizeRedirect = (path: string | null) => {
    if (!path || !path.startsWith('/') || path.startsWith('//')) return '/';
    return path;
};

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const { t } = useTranslation();

    const [email, setEmail] = useState(() => getRememberedEmail());
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(() => getRememberMePreference());
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const redirectPath = sanitizeRedirect(searchParams.get('redirect'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            setError(t('auth.enterEmailPassword'));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, password }),
            });

            const data = await readApiJson<{ error?: string; token?: string; user?: Parameters<typeof login>[1] }>(response);

            if (response.ok && data?.token && data.user) {
                setRememberMePreference(rememberMe);

                if (rememberMe) {
                    setRememberedEmail(trimmedEmail);
                } else {
                    clearRememberedEmail();
                }

                login(data.token, data.user, rememberMe);
                navigate(redirectPath, { replace: true });
            } else {
                setError(
                    isBackendUnavailable(response.status)
                        ? t('auth.connectionError')
                        : getApiErrorMessage(response, data, {
                            connectionError: t('auth.connectionError'),
                            serverError: t('auth.serverError'),
                            fallback: t('auth.wrongCredentials'),
                        }),
                );
            }
        } catch {
            setError(t('auth.connectionError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const registerLink = redirectPath !== '/'
        ? `/register?redirect=${encodeURIComponent(redirectPath)}`
        : '/register';

    return (
        <AuthLayout
            title={t('auth.welcome')}
            imageAlt={t('auth.welcome')}
            footerPrompt={t('auth.noAccount')}
            footerLink={(
                <Link to={registerLink} className={layoutStyles.footerLink}>
                    {t('auth.createAccount')}
                </Link>
            )}
        >
            <form className={authFormStyles.form} onSubmit={handleSubmit} noValidate>
                <FormField label={t('auth.email')} htmlFor="login-email">
                    <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder={t('auth.emailOrPhone')}
                        value={email}
                        autoComplete="email"
                        disabled={isSubmitting}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                </FormField>

                <FormField label={t('auth.password')} htmlFor="login-password">
                    <PasswordInput
                        id="login-password"
                        name="password"
                        placeholder={t('auth.password')}
                        value={password}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </FormField>

                <FormError message={error} />

                <div className={authFormStyles.options}>
                    <label className={authFormStyles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            disabled={isSubmitting}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>{t('auth.rememberMe')}</span>
                    </label>
                    <button
                        type="button"
                        className={authFormStyles.forgotLink}
                        onClick={() => setError(t('auth.forgotPasswordSoon'))}
                    >
                        {t('auth.forgotPassword')}
                    </button>
                </div>

                <Button type="submit" disabled={isSubmitting} className={authFormStyles.submitBtn}>
                    {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
                </Button>
            </form>
        </AuthLayout>
    );
};
