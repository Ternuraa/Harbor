const HEALTH_URL = 'http://localhost:5001/health';
const MAX_ATTEMPTS = 40;
const DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
        const response = await fetch(HEALTH_URL);

        if (response.ok) {
            console.log('✅ Backend готов');
            process.exit(0);
        }
    } catch {
        // backend ещё поднимается
    }

    await sleep(DELAY_MS);
}

console.error('❌ Backend не ответил. Проверьте: npm run backend');
process.exit(1);
