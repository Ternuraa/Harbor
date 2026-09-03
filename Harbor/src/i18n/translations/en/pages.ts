import type { InfoPageContent } from '../../types';

export const enPages: Record<string, InfoPageContent> = {
    privacy: {
        title: 'Privacy Policy',
        meta: 'Last updated: June 21, 2026',
        lead: 'Харбор cares about your privacy. This page explains what data we collect, how we use it, and what rights you have.',
        sections: [
            {
                title: '1. What data we collect',
                paragraphs: [
                    'When you use Харбор, we may process data you provide during registration, booking, and support interactions: name, email, phone, profile details, trip information, and payment data.',
                    'We also collect technical data automatically: IP address, device type, browser, cookies, and activity on the site — for security, analytics, and service improvement.',
                ],
            },
            {
                title: '2. How we use your data',
                list: [
                    'creating and managing your account;',
                    'searching, booking, and supporting trips;',
                    'communicating with guests, hosts, and support;',
                    'keeping the platform secure and preventing fraud;',
                    'improving the interface and personalizing recommendations.',
                ],
            },
            {
                title: '3. Sharing data with third parties',
                paragraphs: [
                    'We do not sell personal data. We may share it only with partners who help us operate: payment providers, hosting providers, analytics, and support services — and only to the extent needed to deliver the service.',
                    'Data may be disclosed when required by law or a lawful request from public authorities.',
                ],
            },
            {
                title: '4. Storage and security',
                paragraphs: [
                    'We retain data for as long as needed to operate the service, meet legal obligations, and resolve disputes. We apply organizational and technical safeguards: encryption, access controls, and incident monitoring.',
                ],
            },
            {
                title: '5. Your rights',
                list: [
                    'request access to your data;',
                    'correct or update information in your profile;',
                    'withdraw consent where applicable;',
                    'request account deletion — via Харбор support.',
                ],
            },
            {
                title: '6. Cookies',
                paragraphs: [
                    'Cookies help maintain your session, search settings, and preferences. You can limit cookies in your browser settings, but some site features may not work correctly.',
                ],
            },
            {
                title: '7. Policy changes',
                paragraphs: [
                    'We may update this policy. The current version is always available on this page. For material changes, we will notify you via the site or email.',
                ],
            },
            {
                title: '8. Contact',
                paragraphs: ['Privacy questions: privacy@harbor.ru'],
            },
        ],
    },
    terms: {
        title: 'Terms of Service',
        meta: 'Last updated: June 21, 2026',
        lead: 'These terms govern how guests and hosts use Харбор. Please read them before booking or listing a property.',
        sections: [
            {
                title: '1. General',
                paragraphs: [
                    'By using Харбор, you agree to these Terms. If you do not agree, please do not use the service.',
                    'Харбор is a platform for finding and booking accommodations. We connect guests and hosts but do not own the listed properties.',
                ],
            },
            {
                title: '2. Account and registration',
                list: [
                    'an account is required to book and manage trips;',
                    'you agree to provide accurate information;',
                    'you are responsible for keeping your password secure and for activity in your account;',
                    'we may restrict access for rule violations or suspected fraud.',
                ],
            },
            {
                title: '3. Booking and payment',
                paragraphs: [
                    'A booking is confirmed after successful checkout on the platform. Price, check-in and check-out dates, and cancellation rules are shown before confirmation.',
                    'Payment is processed through Харбор payment partners. Fees and taxes, if applicable, are shown in booking details.',
                ],
            },
            {
                title: '4. Cancellation and refunds',
                paragraphs: [
                    'Cancellation terms depend on the listing and selected rate. Review cancellation rules on the property page before booking.',
                    'If you cancel within the allowed window, refunds are issued to the original payment method within the stated timeframe.',
                ],
            },
            {
                title: '5. Platform conduct',
                list: [
                    'respectful communication with hosts, guests, and support;',
                    'no fraud, spam, or false information;',
                    'compliance with house rules set by the host;',
                    'no off-platform deals that bypass Харбор.',
                ],
            },
            {
                title: '6. Liability',
                paragraphs: [
                    'Харбор strives to keep listing information up to date but does not guarantee that host-provided descriptions are error-free.',
                    'Disputes between guests and hosts are resolved under platform rules and, when needed, with support involvement.',
                ],
            },
            {
                title: '7. Changes to terms',
                paragraphs: [
                    'We may update these Terms. The current version is published on this page. Continued use after changes means you accept the updated terms.',
                ],
            },
            {
                title: '8. Contact',
                paragraphs: ['Terms questions: legal@harbor.ru'],
            },
        ],
    },
    about: {
        title: 'About Харбор',
        meta: 'Харбор — stays for travel',
        lead: 'We are building a service where it is easy to find a place to stay, book a trip, and feel confident — wherever you are.',
        sections: [
            {
                title: 'Who we are',
                paragraphs: [
                    'Харбор is a platform for finding and booking unique stays around the world. We help guests discover places they want to stay and help hosts share their space with travelers.',
                    'Our goal is to make travel simpler, safer, and more human — from a cozy city apartment to a cottage by the sea or in the mountains.',
                ],
            },
            {
                title: 'Mission',
                paragraphs: [
                    'We believe travel starts not with a hotel, but with a place that feels like home. Харбор connects people who value comfort, trust, and authentic experiences — without unnecessary bureaucracy.',
                ],
            },
            {
                title: 'What we offer',
                list: [
                    'easy search by city, dates, and number of guests;',
                    'transparent booking and cancellation terms;',
                    'favorites and trip management in your account;',
                    'trip ideas and inspiration for new routes;',
                    'support for guests and hosts at every step.',
                ],
            },
            {
                title: 'Safety and trust',
                paragraphs: [
                    'We develop protection tools for both sides: profile verification, house rules, reviews, and support. Харбор is built on openness and mutual respect.',
                ],
            },
            {
                title: 'Team',
                paragraphs: [
                    'Харбор is built by engineers, designers, and hospitality specialists. We work on the product every day — improving search, booking, and the platform experience.',
                ],
            },
            {
                title: 'Contact',
                paragraphs: [
                    'General inquiries: hello@harbor.ru',
                    'Press and partnerships: press@harbor.ru',
                ],
            },
        ],
    },
    cancellationPolicy: {
        title: 'Cancellation policy',
        meta: 'How to cancel a booking and get a refund',
        lead: 'Cancellation terms depend on the listing. Below are general principles and steps for Харбор guests.',
        sections: [
            {
                title: 'How to find cancellation rules',
                paragraphs: [
                    'Each Харбор listing has its own cancellation terms. They are shown on the property page before you confirm a booking — review them before payment.',
                    'Common options: flexible (full refund several days before check-in), moderate (partial refund), and strict (refund only shortly after booking or not at all).',
                ],
            },
            {
                title: 'Flexible cancellation',
                paragraphs: [
                    'With flexible terms, you receive a full refund if you cancel at least 24 hours before check-in (exact timing is shown on the listing).',
                    'If you cancel later, you may be charged for one night or a service fee may be retained.',
                ],
            },
            {
                title: 'Moderate and strict cancellation',
                list: [
                    'moderate — partial refund when canceling 5–7 days before check-in;',
                    'strict — refund only within the first 24–48 hours after booking, if enough time remains before check-in;',
                    'non-refundable rates — no refund for any cancellation, usually offered at a discount.',
                ],
            },
            {
                title: 'How to cancel a booking',
                paragraphs: [
                    'Cancellation is available under Trips in your profile. Select the booking and click Cancel — the system shows the refund amount before confirmation.',
                    'After cancellation, funds return to the original payment method. Timing depends on your bank, typically 5–10 business days.',
                ],
            },
            {
                title: 'Cancellation by the host',
                paragraphs: [
                    'If a host cancels a confirmed booking, we help find an alternative or issue a full refund. Details are sent by email and shown in your account.',
                ],
            },
            {
                title: 'Force majeure',
                paragraphs: [
                    'For unforeseen circumstances (natural disasters, border closures, etc.), contact support — we will review your case individually.',
                ],
            },
        ],
    },
    guestSafety: {
        title: 'Guest safety',
        meta: 'How Харбор protects guests at every stage of a trip',
        lead: 'Tips and rules to help you travel with confidence — from choosing a stay to handling unexpected situations.',
        sections: [
            {
                title: 'Your safety is our priority',
                paragraphs: [
                    'Харбор develops tools that help guests feel confident: profile checks, clear house rules, 24/7 support, and procedures for incidents.',
                ],
            },
            {
                title: 'Before booking',
                list: [
                    'read the listing description, reviews, and house rules;',
                    'check the host rating and booking history;',
                    'keep messages and booking details in the app;',
                    'share trip details with people you trust and keep support contacts handy.',
                ],
            },
            {
                title: 'During your stay',
                list: [
                    'follow house rules and respect neighbors;',
                    'do not share keys or access codes with others;',
                    'if there is a problem with the stay, contact the host through Харбор first;',
                    'in an emergency, call local services (112), then contact support.',
                ],
            },
            {
                title: 'Verification and trust',
                paragraphs: [
                    'We encourage email and phone verification. Hosts can set check-in rules, including ID requirements and arrival times. Suspicious listings are reviewed by our moderation team.',
                ],
            },
            {
                title: 'If something goes wrong',
                paragraphs: [
                    'If the property does not match the description, you have access issues, or you feel unsafe — contact support within 24 hours of check-in.',
                    'We will help you reach the host, find alternative accommodation, or process a refund under platform rules.',
                ],
            },
            {
                title: 'Fraud',
                paragraphs: [
                    'Never pay outside Харбор or follow suspicious links. All payments and bookings must go through the site. Report suspicious activity to safety@harbor.ru.',
                ],
            },
            {
                title: 'Emergency line',
                paragraphs: [
                    '24/7 safety support: safety@harbor.ru',
                    'General support: support@harbor.ru',
                ],
            },
        ],
    },
    contact: {
        title: 'Contact us',
        meta: 'Харбор support',
        lead: 'Write to us — we can help with booking, trips, your account, or any question about the platform.',
        sections: [
            {
                title: 'General inquiries',
                paragraphs: [
                    'Booking, profile, favorites, technical issues.',
                    'support@harbor.ru',
                ],
            },
            {
                title: 'Safety',
                paragraphs: [
                    'Incidents during a stay, suspicious listings, urgent situations.',
                    'safety@harbor.ru — 24/7.',
                ],
            },
            {
                title: 'Refunds and cancellations',
                paragraphs: [
                    'Questions about canceling a booking and refunds.',
                    'refunds@harbor.ru',
                ],
            },
            {
                title: 'For hosts',
                paragraphs: [
                    'Listing a property, calendar, payouts.',
                    'hosts@harbor.ru',
                ],
            },
            {
                title: 'Response time',
                paragraphs: [
                    'We aim to respond within 24 hours. Urgent safety requests are handled as a priority.',
                ],
            },
            {
                title: 'What to include in your message',
                list: [
                    'your Харбор account email;',
                    'booking number, if the question is about a trip;',
                    'a brief description of the situation and desired outcome;',
                    'screenshots or photos, if they help us resolve the issue faster.',
                ],
            },
            {
                title: 'Self-service',
                paragraphs: [
                    'Before contacting support, check Cancellation policy and Guest safety — many common questions are answered there.',
                ],
            },
        ],
    },
    listYourSpace: {
        title: 'List your space',
        meta: 'How to list a property on Харбор',
        lead: 'Share your home with travelers — from a city apartment to a cottage by the sea. A step-by-step path from sign-up to your first booking.',
        sections: [
            {
                title: '1. Create an account',
                paragraphs: [
                    'Sign up on Харбор or log in to an existing account. A verified email is required to list a property.',
                ],
            },
            {
                title: '2. Prepare your listing',
                list: [
                    'well-lit photos — interior, exterior, key areas;',
                    'accurate description: size, bedrooms, amenities, rules;',
                    'address and check-in instructions;',
                    'availability calendar and nightly price.',
                ],
            },
            {
                title: '3. Publish your listing',
                paragraphs: [
                    'Add your property from your account: property type, capacity, amenities, and house rules. Honest, complete descriptions lead to more bookings.',
                    'If you are just getting started — email hosts@harbor.ru and we will help with your first listing.',
                ],
            },
            {
                title: '4. Set your rules',
                paragraphs: [
                    'Choose a cancellation policy, check-in and check-out times, and minimum stay. Guests see these settings before booking.',
                ],
            },
            {
                title: '5. Receive bookings',
                paragraphs: [
                    'After a booking is confirmed, you receive an email notification. Communicate with guests through Харбор, prepare the property for arrival, and follow platform rules.',
                ],
            },
            {
                title: 'Good to know',
                list: [
                    'Харбор charges a service fee on each booking — it is shown when you set your price;',
                    'payouts are processed through payment partners after guest check-in;',
                    'you can block dates and update prices at any time;',
                    'learn more about protection in Host protection.',
                ],
            },
            {
                title: 'Need help?',
                paragraphs: ['hosts@harbor.ru — questions about listing, calendar, and payouts.'],
            },
        ],
    },
    hostProtection: {
        title: 'Host protection',
        meta: 'How Харбор protects your property and interests',
        lead: 'Host protection policy: property, guests, cancellations, and dispute resolution on Харбор.',
        sections: [
            {
                title: 'Protection at every step',
                paragraphs: [
                    'Харбор helps hosts feel confident — from guest screening to dispute resolution and incident support. Protection applies under platform rules and booking terms.',
                ],
            },
            {
                title: 'Property protection',
                paragraphs: [
                    'If a guest damages your property, contact support within 14 days of checkout with photos and a description. We will review your case and help pursue compensation under Харбор policy.',
                    'For serious cases, insurance coverage may apply — details depend on property type and region.',
                ],
            },
            {
                title: 'Verified guests',
                list: [
                    'email and phone verification;',
                    'booking and review history on the platform;',
                    'ability to decline a booking before confirmation if you have concerns;',
                    'all communication and payment through Харбор only.',
                ],
            },
            {
                title: 'Guest cancellations',
                paragraphs: [
                    'If a guest cancels within your policy window, you are paid according to your cancellation rules. For late cancellations, part of the amount may be retained as compensation.',
                    'If a guest does not arrive without canceling, contact support — we will help handle the situation under platform rules.',
                ],
            },
            {
                title: 'Host cancellations',
                paragraphs: [
                    'Canceling a confirmed booking as a host should be a last resort. The guest receives a full refund, and your account may be restricted for frequent cancellations. Contact support before canceling.',
                ],
            },
            {
                title: 'Disputes and incidents',
                list: [
                    'first, try to resolve the issue with the guest via Харбор messages;',
                    'for house rule violations — photos, description, and a support request;',
                    'emergencies — safety@harbor.ru, 24/7;',
                    'general host questions — hosts@harbor.ru.',
                ],
            },
            {
                title: 'Recommendations',
                paragraphs: [
                    'Set clear house rules, document the condition of your property before check-in, and do not share keys or accept payment off-platform. This reduces risk and simplifies dispute resolution.',
                ],
            },
        ],
    },
    hostResources: {
        title: 'Host resources',
        meta: 'Practical tips for Харбор hosts',
        lead: 'How to create a strong listing, communicate with guests, and grow your hosting business on the platform.',
        sections: [
            {
                title: 'Your first listing',
                paragraphs: [
                    'Start with an honest description and quality photos. Include everything guests care about: Wi‑Fi, parking, crib, quiet courtyard. Incomplete descriptions are a common source of dissatisfaction.',
                ],
            },
            {
                title: 'Photos',
                list: [
                    'shoot in daylight, without heavy filters;',
                    'show every bedroom, kitchen, bathroom, and window view;',
                    'add photos of the entrance and outdoor area;',
                    'update images after renovations or furniture changes.',
                ],
            },
            {
                title: 'Pricing and calendar',
                paragraphs: [
                    'Research prices in your area on Харбор. When starting out, you may set a price slightly below average to earn first reviews, then adjust.',
                    'Block dates when your property is unavailable. An up-to-date calendar reduces cancellations and negative reviews.',
                ],
            },
            {
                title: 'Guest communication',
                list: [
                    'respond quickly — it improves booking conversion;',
                    'send check-in instructions the day before arrival;',
                    'be polite and specific: door code, parking, keys;',
                    'keep conversations on the platform — it matters in disputes.',
                ],
            },
            {
                title: 'Preparing for check-in',
                list: [
                    'cleanliness, fresh towels, and basic supplies;',
                    'check Wi‑Fi, hot water, and locks;',
                    'leave emergency contact details;',
                    'match what is shown in your listing.',
                ],
            },
            {
                title: 'Reviews and ratings',
                paragraphs: [
                    'A high rating helps you get more bookings. After checkout, Харбор requests a review — good service and clear communication usually show up in ratings.',
                ],
            },
            {
                title: 'Helpful links',
                list: [
                    'List your space — step-by-step listing guide;',
                    'Host protection — policies and procedures;',
                    'Cancellation policy — how cancellations work for guests and hosts;',
                    'news at /news — updates for hosts.',
                ],
            },
            {
                title: 'Host support',
                paragraphs: [
                    'Questions about listing, calendar, payouts, and disputes: hosts@harbor.ru',
                ],
            },
        ],
    },
};
