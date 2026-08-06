import { useEffect, useState } from 'react';

export const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
};

export const useTodayStart = () => {
    const [todayStart, setTodayStart] = useState(getTodayStart);

    useEffect(() => {
        const syncToday = () => setTodayStart(getTodayStart());

        const now = new Date();
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = nextMidnight.getTime() - now.getTime();

        let dailyInterval: number | undefined;

        const midnightTimeout = window.setTimeout(() => {
            syncToday();
            dailyInterval = window.setInterval(syncToday, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                syncToday();
            }
        };

        window.addEventListener('focus', syncToday);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.clearTimeout(midnightTimeout);
            if (dailyInterval !== undefined) {
                window.clearInterval(dailyInterval);
            }
            window.removeEventListener('focus', syncToday);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return todayStart;
};
