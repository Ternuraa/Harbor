import type { TravelIdea } from '../../pages/TripIdeaPage/types';
import { tripIdeaImages, destinationImages } from '../../pages/TripIdeaPage/images';

const img = tripIdeaImages;
const dest = destinationImages;

export const enTravelIdeas: TravelIdea[] = [
    {
        slug: 'peaks-to-conquer',
        title: 'Peaks worth conquering',
        cardTitle: 'Peaks worth conquering',
        readTime: '7 min read',
        publishedAt: 'June 12, 2026',
        imageUrl: img['peaks-to-conquer'].card,
        heroImage: img['peaks-to-conquer'].hero,
        heroImageAlt: 'Mountain landscape with snow-capped peaks',
        lead: 'Mountains are not just a physical challenge — they are a way to reset your mind. We picked destinations with beginner-friendly trails, cinematic views, and cozy places to stay after the hike.',
        searchQuery: 'Altai',
        ctaTitle: 'Ready for the altitude?',
        ctaText: 'Find cabins and lodges at the foot of the mountains right on Харбор.',
        ctaButton: 'Browse mountain stays',
        blocks: [
            {
                type: 'paragraph',
                text: 'A mountain trip does not have to start with Everest. Russia and neighboring countries are full of routes where you can see glaciers, alpine meadows, and sunrise above the clouds in a single weekend — without mountaineering gear or visa paperwork.'
            },
            {
                type: 'heading',
                text: 'Where to go for mountains'
            },
            {
                type: 'destinations',
                destinations: [
                    {
                        name: 'Altai',
                        country: 'Russia',
                        imageUrl: dest['peaks-to-conquer'].altai,
                        imageAlt: 'Mountain lake in Altai',
                        description: 'Altai means Lake Teletskoye with turquoise water, the Akkem River valley at the foot of Belukha, and the trail to the Lake of Mountain Spirits. Beginner-friendly eco-trails, horseback routes through alpine meadows, and guesthouses right at the trailhead. After a day of climbing — a sauna, dinner by the fire, and starry skies without city light pollution.',
                        bestSeason: 'June — September',
                        priceFrom: 'from 3,500 ₽ / night'
                    },
                    {
                        name: 'Dombay and Arkhyz',
                        country: 'Russia',
                        imageUrl: dest['peaks-to-conquer'].dombay,
                        imageAlt: 'Snow-covered peaks of Dombay',
                        description: 'Dombay and Arkhyz offer cable cars to Belalakaya Peak, routes to the Sufruzhinskie Lakes, and Caucasus Ridge panoramas at every turn. In winter — skiing and freeride; in summer — trekking with glacier views. Villages at the foot of the mountains offer cottages and lodges with kitchens — perfect for a group.',
                        bestSeason: 'July — August, December — March',
                        priceFrom: 'from 4,000 ₽ / night'
                    },
                    {
                        name: 'Kazbek and Stepantsminda',
                        country: 'Georgia',
                        imageUrl: dest['peaks-to-conquer'].kazbek,
                        imageAlt: 'Gergeti Church and Mount Kazbek',
                        description: 'Stepantsminda is a village at the foot of Kazbek, where Gergeti Church stands on a hill overlooking the snow-capped summit. A guided day hike to the Gergeti Glacier is doable in one day, and guesthouses with home cooking await below. The atmosphere is quiet, there are fewer tourists than in Batumi, and visa formalities are zero.',
                        visaInfo: 'visa-free for up to 1 year',
                        bestSeason: 'May — October',
                        priceFrom: 'from 2,500 ₽ / night'
                    },
                    {
                        name: 'Dolomites',
                        country: 'Italy',
                        imageUrl: dest['peaks-to-conquer'].dolomites,
                        imageAlt: 'Dolomite Alps in Italy',
                        description: 'The Dolomites — Seceda with its curved mountain wall, Tre Cime di Lavaredo, and Lake Braies that looks like a fantasy film frame. The Alta Guest Card gives free transport and lift discounts. Routes are well marked, but you need a passport and Schengen visa — though service and infrastructure are better than in Russia\'s mountains.',
                        visaInfo: 'Schengen visa',
                        bestSeason: 'June — September',
                        priceFrom: 'from 8,000 ₽ / night'
                    }
                ]
            },
            {
                type: 'heading',
                text: 'What to pack for a hike'
            },
            {
                type: 'list',
                items: [
                    'Hiking boots with stiff soles — not sneakers.',
                    'Layered clothing: thermal base, fleece, windproof jacket.',
                    'Trekking poles — they take pressure off your knees on descents.',
                    'Flashlight, power bank, and a first-aid kit with blister plasters.',
                    'Sunscreen: you burn faster in the mountains than on the beach.'
                ]
            },
            {
                type: 'image',
                imageUrl: img['peaks-to-conquer'].inline,
                imageAlt: 'Hiker on a mountain trail',
                caption: 'The best views open up where the car cannot reach'
            },
            {
                type: 'heading',
                text: 'How to choose mountain accommodation'
            },
            {
                type: 'paragraph',
                text: 'Look for places with reviews about Wi-Fi and heating — in the mountains that is not a luxury, it is a necessity. Pay attention to the distance to the trailhead: a 15-minute walk in the morning beats an hour on a switchback road. On Харбор you can filter stays by type — cabin or chalet — and see right away how many guests a property fits.'
            }
        ]
    },
    {
        slug: 'secluded-corners',
        title: 'Secluded corners for a reset',
        cardTitle: 'Secluded corners\nfor a reset',
        readTime: '6 min read',
        publishedAt: 'June 8, 2026',
        imageUrl: img['secluded-corners'].card,
        heroImage: img['secluded-corners'].hero,
        heroImageAlt: 'Forest trail in morning fog',
        lead: 'Sometimes the best vacation is when nobody knows where you are. Lakeside villages, forest cabins, and quiet coves that tour buses never reach.',
        searchQuery: 'Karelia',
        ctaTitle: 'Need some quiet?',
        ctaText: 'Find a secluded stay far from tourist routes.',
        ctaButton: 'Find quiet places',
        blocks: [
            {
                type: 'paragraph',
                text: 'Digital detox only works when there is nothing worth scrolling nearby. We picked places with weak cell signal, bright starry skies, and the only morning sounds — birds and water.'
            },
            {
                type: 'heading',
                text: 'Where to disappear for a week'
            },
            {
                type: 'destinations',
                destinations: [
                    {
                        name: 'Karelia',
                        country: 'Russia',
                        imageUrl: dest['secluded-corners'].karelia,
                        imageAlt: 'Forest and lake in Karelia',
                        description: 'Karelia — the skerries of Lake Ladoga, the Ruskeala marble canyon, and villages on the shore of Lake Onega where pines grow right to the water\'s edge. In "quiet" Karelia within 100 km of Petrozavodsk — atmospheric settlements like Kinnerma and Manga, abandoned villages, and places where you will not run into a tour bus in season. Rent a house on the shore: morning steam on the water, sauna in the evening, and complete silence.',
                        bestSeason: 'June — August, February — March',
                        priceFrom: 'from 3,000 ₽ / night'
                    },
                    {
                        name: 'Seliger',
                        country: 'Russia',
                        imageUrl: dest['secluded-corners'].seliger,
                        imageAlt: 'Lake Seliger with islands',
                        description: 'Seliger — a hundred islands, clear water, and forest that meets the lake without promenades or sun loungers. On weekdays there are few people: you can kayak, fish, and stay in a cabin with a water view. Nilova Pustyn and Ostashkov are nearby, but the main program is doing nothing and watching clouds drift by.',
                        bestSeason: 'May — September',
                        priceFrom: 'from 2,500 ₽ / night'
                    },
                    {
                        name: 'Kabardinka',
                        country: 'Russia',
                        imageUrl: dest['secluded-corners'].kabardinka,
                        imageAlt: 'Beach in Kabardinka',
                        description: 'Kabardinka is a quiet resort near Gelendzhik with pebble beaches, clear water, and a mountain ridge behind your back. Less bustle and lower prices than Sochi, with equally warm sea. Morning walks on the promenade without crowds, sunset dinners in the evening. For solitude, choose cabins on the second line from the sea.',
                        bestSeason: 'June — September',
                        priceFrom: 'from 2,800 ₽ / night'
                    },
                    {
                        name: 'Georgia, Svaneti',
                        country: 'Georgia',
                        imageUrl: dest['secluded-corners'].svaneti,
                        imageAlt: 'Mountain landscape of Svaneti',
                        description: 'Svaneti — the towers of Mestia and Ushguli, mountain roads with panoramas, and villages where life follows its own rules. Minimal infrastructure, maximum authenticity: local cuisine, guesthouses, and trails almost no tourists walk. The switchback road is a test, but for complete solitude and views of snow-capped peaks, it is worth it.',
                        visaInfo: 'visa-free for up to 1 year',
                        bestSeason: 'June — September',
                        priceFrom: 'from 3,500 ₽ / night'
                    }
                ]
            },
            {
                type: 'heading',
                text: 'Rules for a secluded getaway'
            },
            {
                type: 'list',
                items: [
                    'Book accommodation with extra food stocked — the nearest shop may be 20 km away.',
                    'Warn loved ones that connectivity will be spotty.',
                    'Bring a book, board games, or a journal — screens get boring fast.',
                    'Ask the host how water, heating, and the generator work.',
                    'Do not plan a packed sightseeing schedule — the point is not to rush.'
                ]
            },
            {
                type: 'image',
                imageUrl: img['secluded-corners'].inline,
                imageAlt: 'Mountain lake at sunrise',
                caption: 'A morning without an alarm — the main luxury of a secluded getaway'
            },
            {
                type: 'paragraph',
                text: 'On Харбор, look for properties outside city centers: private homes, glamping sites, and cottages marked as "quiet area." Read reviews — guests often mention how peaceful it is at night.'
            }
        ]
    },
    {
        slug: 'sea-breeze',
        title: 'Sea breeze and wild beaches',
        cardTitle: 'Sea breeze\nand wild beaches',
        readTime: '8 min read',
        publishedAt: 'February 20, 2026',
        imageUrl: img['sea-breeze'].card,
        heroImage: img['sea-breeze'].hero,
        heroImageAlt: 'Wild beach with turquoise water',
        lead: 'The sound of waves, soft sand, and minimal fuss. We gathered destinations where you can reach the sea without a visa — from Abkhazia to Georgia and Russia\'s Black Sea coast.',
        searchQuery: 'Sochi',
        ctaTitle: 'The sea is calling',
        ctaText: 'Find a beachside cabin — from budget apartments to waterfront villas.',
        ctaButton: 'Browse seaside stays',
        blocks: [
            {
                type: 'paragraph',
                text: 'A beach vacation does not have to mean tourist crowds and sun loungers in three rows. There are coves only a few people reach, and countries Russians can enter visa-free — with a domestic or international passport.'
            },
            {
                type: 'heading',
                text: 'Where to go to the sea without a visa'
            },
            {
                type: 'destinations',
                destinations: [
                    {
                        name: 'Abkhazia',
                        country: 'Russia / Abkhazia',
                        imageUrl: dest['sea-breeze'].abkhazia,
                        imageAlt: 'Beach in Abkhazia',
                        description: 'Abkhazia — Gagra, Pitsunda, and Gudauta: pines down to the water, clear sea, and prices lower than in Sochi. Entry on a Russian passport for up to 90 days, no visa bureaucracy. Pebble and sandy beaches, cozy guesthouses with kitchens in the villages. Ideal for families: warm sea, fewer people than on Russian promenades.',
                        visaInfo: 'visa-free, domestic passport',
                        bestSeason: 'May — October',
                        priceFrom: 'from 3,000 ₽ / night'
                    },
                    {
                        name: 'Georgia, Batumi',
                        country: 'Georgia',
                        imageUrl: dest['sea-breeze'].batumi,
                        imageAlt: 'Batumi and the coastline',
                        description: 'Batumi — mild climate, vineyards by the sea, and a palm-lined promenade, but for quiet Ureki and Kobuleti 20–40 km from the city are better. Visa-free for up to a year, warm sea from June through October. Local cuisine — khinkali and seafood — is one reason people keep coming back.',
                        visaInfo: 'visa-free for up to 1 year',
                        bestSeason: 'June — October',
                        priceFrom: 'from 2,500 ₽ / night'
                    },
                    {
                        name: 'Crimea, wild coves',
                        country: 'Russia',
                        imageUrl: dest['sea-breeze'].crimea,
                        imageAlt: 'Cove in Crimea',
                        description: 'Crimea — coves near Sevastopol, Koktebel, and Ordzhonikidze where you can be alone with the sea. Only a Russian passport is needed. Wild beaches with rocky entries into the water, steppe and mountains nearby — for those tired of promenades. Accommodation in villages is cheaper than in Yalta, and the experience is stronger.',
                        visaInfo: 'visa-free',
                        bestSeason: 'June — September',
                        priceFrom: 'from 3,000 ₽ / night'
                    },
                    {
                        name: 'Turkey',
                        country: 'Turkey',
                        imageUrl: dest['sea-breeze'].turkey,
                        imageAlt: 'Beach in Turkey',
                        description: 'Turkey — Antalya, Kaş, and Fethiye: the Mediterranean and Aegean seas, visa-free for up to 60 days. Off-season beaches are empty, and accommodation prices drop 30–50%. Kaş is for rocky coves and diving lovers; Fethiye is for yachts and lagoons. A classic that never stops working.',
                        visaInfo: 'visa-free for up to 60 days',
                        bestSeason: 'April — November',
                        priceFrom: 'from 3,000 ₽ / night'
                    }
                ]
            },
            {
                type: 'heading',
                text: 'How to save on a seaside trip'
            },
            {
                type: 'list',
                items: [
                    'Travel off-season — from late October through March, accommodation and flights are cheaper.',
                    'Pick a village, not the resort capital: prices are 2–3 times lower.',
                    'Stay on the 3rd or 4th line from the sea — cheaper, and the walk to the beach is good for you.',
                    'Rent an apartment, not a hotel: better value for families and groups.',
                    'Watch for flight and rail deals — connections are often cheaper than direct flights.'
                ]
            },
            {
                type: 'image',
                imageUrl: img['sea-breeze'].inline,
                imageAlt: 'Beach with azure water',
                caption: 'Wild beaches are the best way to disconnect from city noise'
            },
            {
                type: 'heading',
                text: 'What to bring to a wild beach'
            },
            {
                type: 'list',
                items: [
                    'SPF 50+ sunscreen, a hat, and water — remote beaches have no kiosks.',
                    'Water shoes for rocky entries into the water.',
                    'Power bank and cash — card terminals are not everywhere.',
                    'A light backpack instead of a beach bag: the trail may be rocky.'
                ]
            },
            {
                type: 'paragraph',
                text: 'On Харбор you can find accommodation within walking distance of the sea or, conversely, in a quiet village away from the promenade. Enter a city in search and compare nightly rates — from budget studios to waterfront homes.'
            }
        ]
    },
    {
        slug: 'tropical-paradise',
        title: 'Tropical getaway among the palms',
        cardTitle: 'Tropical getaway\namong the palms',
        readTime: '7 min read',
        publishedAt: 'June 3, 2026',
        imageUrl: img['tropical-paradise'].card,
        heroImage: img['tropical-paradise'].hero,
        heroImageAlt: 'Tropical beach with palm trees',
        lead: 'Palms, coconuts, and +30 °C year-round — the tropics are closer than they seem. Visa-free entry, direct flights, and stays from 2,000 ₽ per night.',
        searchQuery: 'Phuket',
        ctaTitle: 'Tropical season',
        ctaText: 'Find a villa or apartment by the ocean in Asia.',
        ctaButton: 'Search the tropics',
        blocks: [
            {
                type: 'paragraph',
                text: 'A tropical vacation does not have to cost half a car. Thailand, Vietnam, Sri Lanka, and the UAE welcome Russians visa-free, and direct flights from Moscow and regional cities make the trip easier.'
            },
            {
                type: 'heading',
                text: 'Where to fly for palms'
            },
            {
                type: 'destinations',
                destinations: [
                    {
                        name: 'Thailand',
                        country: 'Thailand',
                        imageUrl: dest['tropical-paradise'].thailand,
                        imageAlt: 'Tropical beach in Thailand',
                        description: 'Thailand — Phuket, Samui, and Krabi: palms, azure water, and street food you will not find in a hotel. Visa-free for up to 60 days, direct flights from Moscow. Phuket for active holidays, Samui for quiet, Krabi for cliffs and lagoons. Apartments from 2,000 ₽, villas from 15,000 ₽ — something for every budget.',
                        visaInfo: 'visa-free for up to 60 days',
                        bestSeason: 'November — March',
                        priceFrom: 'from 2,000 ₽ / night'
                    },
                    {
                        name: 'Vietnam',
                        country: 'Vietnam',
                        imageUrl: dest['tropical-paradise'].vietnam,
                        imageAlt: 'Beach in Vietnam',
                        description: 'Vietnam — Nha Trang, Phu Quoc, and Da Nang: warm sea, low prices, and cuisine that is hard to walk away from. Visa-free for up to 45 days. Phu Quoc is an island with white sand and minimal bustle; Nha Trang has a long promenade and cheap accommodation. Apartments from 3,000 ₽, hotels from 4,000 ₽ — one of the most budget-friendly tropics.',
                        visaInfo: 'visa-free for up to 45 days',
                        bestSeason: 'November — April',
                        priceFrom: 'from 3,000 ₽ / night'
                    },
                    {
                        name: 'Sri Lanka',
                        country: 'Sri Lanka',
                        imageUrl: dest['tropical-paradise'].srilanka,
                        imageAlt: 'Resort in Sri Lanka',
                        description: 'Sri Lanka — Unawatuna, Mirissa, and Bentota: surfing, whales off the coast, and tea plantations in the mountains. Free ETA for 30 days. Fewer skyscrapers than in Asia, more nature and authenticity. Apartments from 2,500 ₽ — a good option if you want to combine beach and sightseeing.',
                        visaInfo: 'ETA for 30 days, free',
                        bestSeason: 'December — April',
                        priceFrom: 'from 2,500 ₽ / night'
                    },
                    {
                        name: 'UAE',
                        country: 'UAE',
                        imageUrl: dest['tropical-paradise'].uae,
                        imageAlt: 'Seaside hotel in the UAE',
                        description: 'The UAE — Dubai, Fujairah, and Ras Al Khaimah: desert and sea in one ticket, visa-free for 90 days. Pricier than Asia, but top-tier service: clean beaches, hotels with pools, and restaurants for every budget. Fujairah is quieter than Dubai and closer to nature; Ras Al Khaimah is for those who want peace without giving up comfort.',
                        visaInfo: 'visa-free for up to 90 days',
                        bestSeason: 'March — May, September — December',
                        priceFrom: 'from 8,000 ₽ / night'
                    }
                ]
            },
            {
                type: 'heading',
                text: 'When to go to the tropics'
            },
            {
                type: 'paragraph',
                text: 'Each destination has its own rainy season. For the Andaman Sea (Thailand, Vietnam), the best window is November through April: calm sea, +28…+32 °C. In the UAE, October through May is comfortable — in summer at +40 °C, it is better not to risk it.'
            },
            {
                type: 'image',
                imageUrl: img['tropical-paradise'].inline,
                imageAlt: 'Palms on a tropical beach',
                caption: 'High season in Asia is when it is winter in Russia'
            },
            {
                type: 'heading',
                text: 'Budget for a week for two'
            },
            {
                type: 'list',
                items: [
                    'Vietnam — from 170,000 ₽ (accommodation + food + transfers, excluding flights).',
                    'Thailand — from 175,000 ₽ if you skip five-star resorts only.',
                    'Sri Lanka — from 280,000 ₽, but with unique nature and cuisine.',
                    'UAE — from 200,000 ₽ if you choose Fujairah over Dubai.'
                ]
            },
            {
                type: 'paragraph',
                text: 'Book accommodation with a kitchen — hotel breakfasts eat into the budget. On Харбор, compare apartments and villas: for the tropics it is often cheaper to rent a house for a week than to pay for a hotel night by night.'
            }
        ]
    }
];
