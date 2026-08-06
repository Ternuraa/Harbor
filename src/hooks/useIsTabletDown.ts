import { useEffect, useState } from 'react';

const TABLET_DOWN_QUERY = '(max-width: 1023px)';

export const useIsTabletDown = () => {
    const [isTabletDown, setIsTabletDown] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia(TABLET_DOWN_QUERY).matches : false,
    );

    useEffect(() => {
        const media = window.matchMedia(TABLET_DOWN_QUERY);
        const handleChange = () => setIsTabletDown(media.matches);

        handleChange();
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    return isTabletDown;
};
