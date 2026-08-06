import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import layoutStyles from '../PrivacyPage/PrivacyPage.module.scss';
import styles from './SitemapPage.module.scss';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { travelIdeas } from '../TripIdeaPage/travelIdeas';
import { useTranslation } from '../../i18n/useTranslation';

export const SitemapPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, tNewsItems, dictionary } = useTranslation();
    const sitemap = dictionary.sitemap;
    const home = dictionary.home;
    const profileNav = dictionary.profile.nav;

    const SITEMAP_GROUPS = [
        {
            title: sitemap.groups.main,
            links: [
                { label: sitemap.links.home, to: '/' },
                { label: sitemap.links.search, to: '/search' },
                { label: sitemap.links.favorites, to: '/favorites' },
            ],
        },
        {
            title: sitemap.groups.profile,
            links: [
                { label: sitemap.links.profile, to: '/profile' },
                { label: profileNav.trips, to: '/profile?tab=trips' },
                { label: profileNav.pastTrips, to: '/profile?tab=past-trips' },
                { label: profileNav.personal, to: '/profile?tab=personal' },
                { label: profileNav.payments, to: '/profile?tab=payments' },
                { label: profileNav.security, to: '/profile?tab=security' },
            ],
        },
        {
            title: sitemap.groups.account,
            links: [
                { label: sitemap.links.login, to: '/login' },
                { label: sitemap.links.register, to: '/register' },
            ],
        },
        {
            title: sitemap.groups.ideas,
            links: travelIdeas.map((idea) => ({
                label: home.travelIdeaTitles[idea.slug] ?? idea.cardTitle,
                to: `/ideas/${idea.slug}`,
            })),
        },
        {
            title: sitemap.groups.support,
            links: [
                { label: t('footer.cancellation'), to: '/cancellation-policy' },
                { label: t('footer.guestSafety'), to: '/guest-safety' },
                { label: t('footer.contact'), to: '/contact' },
            ],
        },
        {
            title: sitemap.groups.hosts,
            links: [
                { label: t('footer.listYourSpace'), to: '/list-your-space' },
                { label: t('footer.hostProtection'), to: '/host-protection' },
                { label: t('footer.hostResources'), to: '/host-resources' },
            ],
        },
        {
            title: sitemap.groups.about,
            links: [
                { label: t('footer.about'), to: '/about' },
                { label: t('footer.news'), to: '/news' },
                //{ label: sitemap.links.uiKit, to: '/ui-kit' },
            ],
        },
        {
            title: sitemap.groups.news,
            links: [
                { label: sitemap.links.allNews, to: '/news' },
                ...tNewsItems().map((item) => ({
                    label: item.title,
                    to: `/news/${item.slug}`,
                })),
            ],
        },
        {
            title: sitemap.groups.legal,
            links: [
                { label: sitemap.links.terms, to: '/terms' },
                { label: sitemap.links.privacy, to: '/privacy' },
                { label: sitemap.links.sitemap, to: '/sitemap' },
            ],
        },
    ];

    return (
        <PageLayout container="narrow">
            <BackButton className={layoutStyles.backButton} onClick={() => navigate(-1)}>
                {t('common.back')}
            </BackButton>

            <article className={layoutStyles.article}>
                <header className={layoutStyles.pageHeader}>
                    <h1 className={layoutStyles.title}>{sitemap.title}</h1>
                    <p className={layoutStyles.meta}>{sitemap.meta}</p>
                </header>

                <p className={layoutStyles.lead}>{sitemap.lead}</p>

                <div className={layoutStyles.content}>
                    {SITEMAP_GROUPS.map((group) => (
                        <section key={group.title} className={styles.group}>
                            <h2 className={layoutStyles.sectionTitle}>{group.title}</h2>
                            <ul className={styles.links}>
                                {group.links.map((link) => (
                                    <li key={`${group.title}-${link.to}-${link.label}`}>
                                        <Link to={link.to} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </article>
        </PageLayout>
    );
};
