#!/usr/bin/env node
/**
 * Проверка env перед деплоем. Запуск: node scripts/check-deploy-env.mjs
 */
const checks = {
    backend: [
        { key: 'DATABASE_URL', required: true, hint: 'Строка подключения PostgreSQL от Neon/Render/Supabase' },
        { key: 'JWT_SECRET', required: true, minLength: 32, hint: 'Случайный секрет ≥32 символов' },
        { key: 'CORS_ORIGINS', required: true, hint: 'URL фронтенда, например https://harbor-web.onrender.com' },
        { key: 'PGSSL', required: false, expected: 'true', hint: 'true для managed Postgres' },
    ],
    frontend: [
        { key: 'VITE_API_URL', required: true, hint: 'URL backend, например https://harbor-api.onrender.com' },
    ],
};

const target = process.argv[2] || 'backend';
const list = checks[target];

if (!list) {
    console.error('Usage: node scripts/check-deploy-env.mjs [backend|frontend]');
    process.exit(1);
}

let failed = 0;

for (const item of list) {
    const value = process.env[item.key];
    if (!value && item.required) {
        console.error(`✗ ${item.key} — не задан. ${item.hint}`);
        failed += 1;
        continue;
    }
    if (value && item.minLength && value.length < item.minLength) {
        console.error(`✗ ${item.key} — слишком короткий (мин. ${item.minLength})`);
        failed += 1;
        continue;
    }
    if (value && item.expected && value !== item.expected) {
        console.warn(`⚠ ${item.key} — ожидается "${item.expected}", сейчас "${value}"`);
    }
    if (value) {
        console.log(`✓ ${item.key}`);
    }
}

if (failed > 0) {
    process.exit(1);
}

console.log(`\n${target}: env выглядит готовым к деплою`);
