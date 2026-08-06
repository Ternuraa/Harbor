import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';

const rootDbPath = new URL('../db.json', import.meta.url);
const cardDbPath = new URL('../db_card.json', import.meta.url);
const srcDbPath = new URL('../src/db.json', import.meta.url);
const publicDbPath = new URL('../public/db.json', import.meta.url);

const db = JSON.parse(readFileSync(rootDbPath, 'utf-8'));

const defaultBookingsById = {
    1: [{ start: '2026-07-10', end: '2026-07-15' }],
    2: [{ start: '2026-06-18', end: '2026-06-20' }],
    3: [{ start: '2026-08-01', end: '2026-08-07' }],
    5: [{ start: '2026-06-21', end: '2026-06-25' }],
    8: [{ start: '2026-09-12', end: '2026-09-18' }],
    11: [{ start: '2026-06-18', end: '2026-06-19' }],
    12: [],
    15: [{ start: '2026-06-18', end: '2026-06-20' }],
    17: [{ start: '2026-07-01', end: '2026-07-10' }],
};

const localImage = (id) => `/images/properties/${id}/card.webp`;

const createPropertyTemplate = (base) => ({
    images: [localImage(base.id)],
    amenities: [
        { icon: '📶', name: 'Wi-fi' },
        { icon: '🍳', name: 'Кухня' },
    ],
    host: {
        name: 'Хозяин',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        about: 'Рад приветствовать гостей и помочь с советами по городу.',
    },
    locationDetails: {
        address: base.location,
        neighborhood: base.location,
        description: 'Удобный район с развитой инфраструктурой.',
        transport: [],
        infrastructure: [],
    },
    bookedDates: defaultBookingsById[base.id] ?? [],
    ...base,
    imageUrl: localImage(base.id),
});

db.properties = db.properties.map((property) => ({
    ...property,
    bookedDates: defaultBookingsById[property.id] ?? property.bookedDates ?? [],
}));

const cardProperties = [
    {
        id: 15,
        city: 'Санкт-Петербург',
        title: 'Квартира у Анны',
        location: 'Центральный район, Санкт-Петербург',
        description:
            'Светлая квартира с современным ремонтом. Идеально подходит для пары или соло-путешественника. В пешей доступности метро и главные достопримечательности.',
        pricePerNight: 7000,
        totalPrice: '14 000 ₽ за 2 ночи',
        rating: 4.89,
        reviewsCount: 102,
        isVerified: true,
        noCommission: true,
    },
    {
        id: 16,
        city: 'Санкт-Петербург',
        title: 'Комната в гостевом доме «У реки»',
        location: 'Фрунзенский район, Санкт-Петербург',
        description:
            'Светлая комната в моей квартире с современным ремонтом. Делала всё как для себя, чтобы вам было комфортно. До метро всего 5 минут пешком.',
        pricePerNight: 8200,
        totalPrice: '16 400 ₽ за 2 ночи',
        rating: 4.54,
        reviewsCount: 14,
        isVerified: false,
        noCommission: false,
    },
    {
        id: 17,
        city: 'Санкт-Петербург',
        title: 'Уютный уголок на Петроградке',
        location: 'Петроградский район, Санкт-Петербург',
        description:
            'Сдаю комнату в своей квартире. Петроградка — это про архитектуру и лучшие кофейни. Очень ценю чистоту, поэтому жду аккуратных и приятных людей.',
        pricePerNight: 4400,
        totalPrice: '8 800 ₽ за 2 ночи',
        rating: 5.0,
        reviewsCount: 2,
        isVerified: false,
        noCommission: true,
    },
    {
        id: 18,
        city: 'Москва',
        title: 'Апартаменты в Москва-Сити',
        location: 'Пресненский район, Москва',
        description: 'Шикарный вид на город с 65 этажа. Панорамные окна, дизайнерский ремонт, джакузи.',
        pricePerNight: 15000,
        totalPrice: '30 000 ₽ за 2 ночи',
        rating: 4.95,
        reviewsCount: 340,
        isVerified: true,
        noCommission: true,
    },
    {
        id: 19,
        city: 'Москва',
        title: 'Студия на Арбате',
        location: 'Арбат, Москва',
        description:
            'Тихая студия в историческом центре. Идеально для туристов, которые хотят жить в самом сердце столицы.',
        pricePerNight: 5500,
        totalPrice: '11 000 ₽ за 2 ночи',
        rating: 4.7,
        reviewsCount: 88,
        isVerified: false,
        noCommission: true,
    },
];

const existingIds = new Set(db.properties.map((property) => property.id));
const mergedCardProperties = cardProperties
    .filter((property) => !existingIds.has(property.id))
    .map(createPropertyTemplate);

db.properties.push(...mergedCardProperties);

writeFileSync(srcDbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf-8');

if (existsSync(publicDbPath)) {
    unlinkSync(publicDbPath);
}

if (existsSync(cardDbPath)) {
    unlinkSync(cardDbPath);
}

if (existsSync(rootDbPath)) {
    unlinkSync(rootDbPath);
}

console.log(`Unified database: ${db.properties.length} properties -> src/db.json`);
