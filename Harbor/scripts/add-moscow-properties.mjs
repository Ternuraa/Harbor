import { readFileSync, writeFileSync } from 'fs';

const dbPath = new URL('../src/db.json', import.meta.url);
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

const localImage = (id) => `/images/properties/${id}/card.webp`;

const moscowProperties = [
    {
        id: 20,
        title: 'Пентхаус на Патриарших',
        location: 'Москва • Пресненский район',
        pricePerNight: 18000,
        totalPrice: '36 000 ₽ за 2 ночи',
        rating: 4.97,
        reviewsCount: 56,
        description:
            'Роскошный пентхаус с террасой и видом на Москву-реку. Дизайнерский интерьер, камин и отдельная гардеробная. Идеально для особого случая.',
        isVerified: true,
        noCommission: true,
        bookedDates: [{ start: '2026-08-10', end: '2026-08-14' }],
        neighborhood: 'Пресненский район, Москва',
        address: 'Москва, Большой Патриарший переулок, 15',
        hostName: 'Виктория',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🔥', name: 'Камин' },
            { icon: '🛁', name: 'Джакузи' },
        ],
    },
    {
        id: 21,
        title: 'Квартира у Кремля',
        location: 'Москва • Тверской район',
        pricePerNight: 9800,
        totalPrice: '19 600 ₽ за 2 ночи',
        rating: 4.88,
        reviewsCount: 143,
        description:
            'Просторная двухкомнатная квартира в шаговой доступности от Красной площади. Высокие потолки, паркет и вид на исторический центр.',
        isVerified: true,
        noCommission: true,
        bookedDates: [{ start: '2026-06-25', end: '2026-06-28' }],
        neighborhood: 'Тверской район, Москва',
        address: 'Москва, ул. Моховая, 7',
        hostName: 'Ольга',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🍳', name: 'Кухня' },
            { icon: '❄️', name: 'Кондиционер' },
        ],
    },
    {
        id: 22,
        title: 'Лофт в Замоскворечье',
        location: 'Москва • Замоскворечье',
        pricePerNight: 7600,
        totalPrice: '15 200 ₽ за 2 ночи',
        rating: 4.82,
        reviewsCount: 37,
        description:
            'Просторный лофт в историческом особняке. Кирпичные стены, антресоли и большие окна. Рядом Третьяковская галерея и уютные рестораны.',
        isVerified: false,
        noCommission: true,
        bookedDates: [],
        neighborhood: 'Замоскворечье, Москва',
        address: 'Москва, Большая Ордынка, 45',
        hostName: 'Артём',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '💻', name: 'Рабочее место' },
            { icon: '☕', name: 'Кофемашина' },
        ],
    },
    {
        id: 23,
        title: 'Студия у метро Курская',
        location: 'Москва • Басманный район',
        pricePerNight: 4800,
        totalPrice: '9 600 ₽ за 2 ночи',
        rating: 4.65,
        reviewsCount: 29,
        description:
            'Компактная студия для одного или пары. Свежий ремонт, удобная кровать и быстрый доступ к центру на метро. Отличный вариант для краткой поездки.',
        isVerified: false,
        noCommission: false,
        bookedDates: [{ start: '2026-07-05', end: '2026-07-08' }],
        neighborhood: 'Басманный район, Москва',
        address: 'Москва, ул. Земляной Вал, 21',
        hostName: 'Кирилл',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🧺', name: 'Стиральная машина' },
        ],
    },
    {
        id: 24,
        title: 'Двухкомнатная у ВДНХ',
        location: 'Москва • Останкинский район',
        pricePerNight: 5900,
        totalPrice: '11 800 ₽ за 2 ночи',
        rating: 4.74,
        reviewsCount: 61,
        description:
            'Светлая квартира для семьи рядом с ВДНХ и Ботаническим садом. Две спальни, балкон и полностью оборудованная кухня.',
        isVerified: true,
        noCommission: true,
        bookedDates: [],
        neighborhood: 'Останкинский район, Москва',
        address: 'Москва, проспект Мира, 119',
        hostName: 'Наталья',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🍳', name: 'Кухня' },
            { icon: '🅿️', name: 'Парковка' },
        ],
    },
    {
        id: 25,
        title: 'Уютная комната на Таганке',
        location: 'Москва • Таганский район',
        pricePerNight: 3900,
        totalPrice: '7 800 ₽ за 2 ночи',
        rating: 4.58,
        reviewsCount: 18,
        description:
            'Отдельная комната в тихой квартире. Атмосферный район с театрами, рынком и пешими маршрутами по набережной Яузы.',
        isVerified: false,
        noCommission: true,
        bookedDates: [{ start: '2026-09-01', end: '2026-09-04' }],
        neighborhood: 'Таганский район, Москва',
        address: 'Москва, ул. Таганская, 32',
        hostName: 'Светлана',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🍳', name: 'Общая кухня' },
        ],
    },
    {
        id: 26,
        title: 'Апартаменты в Хамовниках',
        location: 'Москва • Хамовники',
        pricePerNight: 11200,
        totalPrice: '22 400 ₽ за 2 ночи',
        rating: 4.91,
        reviewsCount: 95,
        description:
            'Элегантные апартаменты в престижном районе. Рядом Парк Горького, Новодевичий монастырь и лучшие рестораны столицы.',
        isVerified: true,
        noCommission: true,
        bookedDates: [{ start: '2026-10-12', end: '2026-10-16' }],
        neighborhood: 'Хамовники, Москва',
        address: 'Москва, ул. Усачёва, 10',
        hostName: 'Михаил',
        amenities: [
            { icon: '📶', name: 'Wi-fi' },
            { icon: '🍳', name: 'Кухня' },
            { icon: '📺', name: 'Smart TV' },
            { icon: '❄️', name: 'Кондиционер' },
        ],
    },
];

const buildProperty = (item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    pricePerNight: item.pricePerNight,
    totalPrice: item.totalPrice,
    rating: item.rating,
    reviewsCount: item.reviewsCount,
    imageUrl: localImage(item.id),
    images: [localImage(item.id)],
    description: item.description,
    amenities: item.amenities,
    host: {
        name: item.hostName,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        about: `Живу в Москве и с удовольствием делюсь любимыми местами района.`,
    },
    isVerified: item.isVerified,
    noCommission: item.noCommission,
    city: 'Москва',
    bookedDates: item.bookedDates,
    locationDetails: {
        address: item.address,
        neighborhood: item.neighborhood,
        description: 'Удобный район с развитой инфраструктурой и быстрым доступом к метро.',
        transport: [
            {
                id: 1,
                icon: '🚇',
                name: 'Метро поблизости',
                time: '5–10 мин',
            },
        ],
        infrastructure: [
            {
                id: 1,
                icon: '🛒',
                name: 'Супермаркет',
                time: '5 мин',
            },
        ],
    },
});

const existingIds = new Set(db.properties.map((property) => property.id));
const newProperties = moscowProperties
    .filter((property) => !existingIds.has(property.id))
    .map(buildProperty);

db.properties.push(...newProperties);

writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf-8');
console.log(`Added ${newProperties.length} Moscow properties. Total: ${db.properties.length}`);
