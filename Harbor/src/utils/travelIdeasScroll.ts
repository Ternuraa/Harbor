export const TRAVEL_IDEAS_SECTION_ID = 'travel-ideas';

const SESSION_KEY = 'harbor:scroll-to-travel-ideas';

export function markTravelIdeasReturn() {
    sessionStorage.setItem(SESSION_KEY, '1');
}

export function shouldScrollToTravelIdeas(locationState: unknown): boolean {
    const scrollTarget = (locationState as { scrollTo?: string } | null)?.scrollTo;

    return scrollTarget === TRAVEL_IDEAS_SECTION_ID
        || sessionStorage.getItem(SESSION_KEY) === '1';
}

export function scrollToTravelIdeasSection() {
    sessionStorage.removeItem(SESSION_KEY);

    const section = document.getElementById(TRAVEL_IDEAS_SECTION_ID);
    if (!section) return;

    section.scrollIntoView({ block: 'start' });
}
