import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/db.json');

const amenityMatchers = {
    wifi: ['wi-fi', 'wi fi', 'wifi'],
    kitchen: ['кухня', 'посудой'],
    washer: ['стиральн'],
    ac: ['кондиционер'],
    parking: ['парковк'],
    pets: ['питомц', 'животн'],
};

const getPropertyType = (title) => {
    const value = title.toLowerCase();
    if (value.includes('студия')) return 'studio';
    if (value.includes('комната')) return 'room';
    if (value.includes('дом') || value.includes('коттедж') || value.includes('пентхаус')) return 'house';
    if (value.includes('лофт')) return 'apartment';
    return 'apartment';
};

const getAmenityIds = (amenities = []) => {
    const names = amenities.map((item) => item.name.toLowerCase()).join(' ');
    return Object.entries(amenityMatchers)
        .filter(([, matchers]) => matchers.some((matcher) => names.includes(matcher)))
        .map(([id]) => id);
};

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.properties = db.properties.map((property) => ({
    ...property,
    propertyType: property.propertyType ?? getPropertyType(property.title),
    amenityIds: property.amenityIds ?? getAmenityIds(property.amenities),
}));

fs.writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);
console.log(`Updated ${db.properties.length} properties`);
