import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UiKitPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { Input } from '../../components/ui/Input/Input';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch/ToggleSwitch';
import { Pill } from '../../components/ui/Pill/Pill';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { ResponsiveImage } from '../../components/ui/ResponsiveImage/ResponsiveImage';
import { useTranslation } from '../../i18n/useTranslation';

const Swatch: React.FC<{ name: string; token: string; hex: string }> = ({ name, token, hex }) => (
    <div className={styles.swatch}>
        <div className={styles.swatchColor} style={{ backgroundColor: hex }} />
        <div className={styles.swatchMeta}>
            <span className={styles.swatchName}>{name}</span>
            <code>{token}</code>
            <code>{hex}</code>
        </div>
    </div>
);

export const UiKitPage: React.FC = () => {
    const { t } = useTranslation();
    const [toggleOn, setToggleOn] = useState(true);

    return (
        <PageLayout container="narrow">
            <BackButton className={styles.back} onClick={() => window.history.back()}>
                {t('common.back')}
            </BackButton>

            <header className={styles.pageHeader}>
                <h1 className={styles.title}>Харбор UI Kit</h1>
                <p className={styles.lead}>
                    Библиотека компонентов и design tokens проекта. Все цвета и шрифты заданы в{' '}
                    <code>src/styles/variables.scss</code>.
                </p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Цвета</h2>
                <div className={styles.swatchGrid}>
                    <Swatch name="Main" token="$color-main" hex="#2CB2FA" />
                    <Swatch name="Text" token="$color-text-black" hex="#222222" />
                    <Swatch name="Secondary text" token="$color-text-main" hex="#8F8F8F" />
                    <Swatch name="Background" token="$color-background" hex="#F6F6F6" />
                    <Swatch name="Success" token="$color-success" hex="#10B981" />
                    <Swatch name="Danger" token="$color-danger" hex="#FF4848" />
                    <Swatch name="Accent red" token="$color-accent-red" hex="#FF385C" />
                    <Swatch name="Link" token="$color-link" hex="#38BDF8" />
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Типографика</h2>
                <div className={styles.typeScale}>
                    <p className={styles.typeH1}>H1 — 32px / 40px</p>
                    <p className={styles.typeH2}>H2 — 24px / 32px</p>
                    <p className={styles.typeH3}>H3 — 20px / 28px</p>
                    <p className={styles.typeLg}>Large — 16px / 24px</p>
                    <p className={styles.typeBase}>Base — 14px / 20px</p>
                    <p className={styles.typeCaption}>Caption — 12px / 16px</p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Кнопки</h2>
                <div className={styles.row}>
                    <div className={styles.sample}>
                        <Button variant="primary">Primary</Button>
                    </div>
                    <div className={styles.sample}>
                        <Button variant="secondary">Secondary</Button>
                    </div>
                    <div className={styles.sample}>
                        <Button variant="outline">Outline</Button>
                    </div>
                    <div className={styles.sample}>
                        <Button variant="danger">Danger</Button>
                    </div>
                    <div className={styles.sample}>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Бейджи</h2>
                <div className={styles.badgeRow}>
                    <Badge text="Подтверждено" variant="confirmed" />
                    <Badge text="Verified" variant="verified" />
                    <Badge text="Success" variant="success" />
                    <Badge text="Completed" variant="completed" />
                    <Badge text="Ideas" variant="ideas" />
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Поля ввода</h2>
                <div className={styles.formGrid}>
                    <Input value="guest@harbor.ru" onChange={() => undefined} placeholder="Email" />
                    <Input value="" onChange={() => undefined} disabled placeholder="Недоступно" />
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Переключатель и pill</h2>
                <div className={styles.inlineRow}>
                    <ToggleSwitch checked={toggleOn} onChange={setToggleOn} />
                    <span>{toggleOn ? 'Включено' : 'Выключено'}</span>
                    <Pill label="Москва" isActive onClick={() => undefined} />
                    <Pill label="Сочи" onClick={() => undefined} />
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Отступы</h2>
                <ul className={styles.spacingList}>
                    <li><code>$gap-xxs</code> — 4px</li>
                    <li><code>$gap-sm</code> — 8px</li>
                    <li><code>$gap-md</code> — 12px</li>
                    <li><code>$gap-lg</code> — 16px</li>
                    <li><code>$gap-block</code> — 32px</li>
                    <li><code>$gap-section</code> — 64px</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Retina WebP (srcset)</h2>
                <p className={styles.lead}>
                    Компонент <code>ResponsiveImage</code> автоматически добавляет{' '}
                    <code>picture + srcset</code> для путей вида <code>/images/.../*.webp</code>.
                </p>
                <ResponsiveImage
                    src="/images/properties/1/card.webp"
                    alt="Пример retina WebP"
                    className={styles.demoImage}
                />
            </section>

            <footer className={styles.footer}>
                <Link to="/sitemap">Карта сайта</Link>
            </footer>
        </PageLayout>
    );
};
