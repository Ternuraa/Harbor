import type { TranslationDictionary } from '../../types';

export const enNews: TranslationDictionary['news'] = {
    title: 'News',
    meta: 'Харбор product updates and announcements',
    lead: 'Product news, new features, and platform updates.',
    backToNews: 'All news',
    items: [
        {
            slug: 'harbor-launch',
            title: 'Харбор launches bookings across Russia',
            date: 'June 15, 2026',
            excerpt:
                'The platform opened search and booking in dozens of cities — from Moscow to Lake Baikal.',
            paragraphs: [
                'Starting today, guests can search stays by dates and number of guests, save favorites, and complete bookings directly on the site.',
                'Hosts get tools to list properties, manage calendars, and communicate with guests. In the coming weeks we will add new destinations and expand the catalog.',
            ],
        },
        {
            slug: 'favorites-feature',
            title: 'Favorites: save stays for your next trip',
            date: 'June 10, 2026',
            excerpt:
                'A new feature lets you build a list of liked properties and return to them anytime.',
            paragraphs: [
                'The Add to favorites button is available on property cards and listing pages. The list syncs with your account — after sign-in you will see everything saved on any device.',
                'Favorites help you compare options and keep great finds while you plan your route.',
            ],
        },
        {
            slug: 'trip-ideas',
            title: 'Trip ideas: inspiration before you book',
            date: 'June 5, 2026',
            excerpt:
                'We launched a section with curated destinations — mountains, sea, secluded spots, and tropics.',
            paragraphs: [
                'Each collection includes ready-made routes, tips, and a link to search stays in the region. Start with an idea and go straight to booking.',
                'The section already covers four themes: peaks, sea breeze, secluded places, and tropical getaways. More destinations coming soon.',
            ],
        },
        {
            slug: 'host-protection',
            title: 'Host protection: updated policies',
            date: 'May 28, 2026',
            excerpt: 'Харбор clarified host protection policies and dispute resolution procedures.',
            paragraphs: [
                'Updated rules describe how the platform helps with cancellations, property damage, and house rule violations. Details are in the hosts section.',
                'We continue to improve verification and support tools to make hosting on the platform predictable for both sides.',
            ],
        },
    ],
};
