import { readFileSync, writeFileSync } from 'fs';

const dbPath = new URL('../src/db.json', import.meta.url);
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

const localImage = (id) => `/images/properties/${id}/card.webp`;

db.properties = db.properties.map((property) => ({
    ...property,
    imageUrl: localImage(property.id),
    images: property.images ? [localImage(property.id), ...property.images.slice(1)] : [localImage(property.id)],
}));

writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf-8');
console.log(`Updated image paths for ${db.properties.length} properties in src/db.json`);
