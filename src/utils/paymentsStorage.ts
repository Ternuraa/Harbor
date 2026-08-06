export interface SavedCard {
    id: string;
    last4: string;
    expiry: string;
    brand: string;
    isDefault: boolean;
}

export interface AppliedPromo {
    code: string;
    percent: number;
}

export interface PromoDefinition {
    code: string;
    percent: number;
}

const CARDS_KEY = 'harbor-saved-cards';
const LOYALTY_KEY = 'harbor-loyalty-points';
export const BOOKING_LOYALTY_REWARD = 200;

export const AVAILABLE_PROMOS: PromoDefinition[] = [
    { code: 'WELCOME15', percent: 15 },
];

export const findPromo = (rawCode: string): PromoDefinition | null => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) return null;
    return AVAILABLE_PROMOS.find((promo) => promo.code === normalized) ?? null;
};

export const getSavedCards = (): SavedCard[] => {
    try {
        const raw = localStorage.getItem(CARDS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as SavedCard[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const saveSavedCards = (cards: SavedCard[]) => {
    try {
        localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    } catch {
        // ignore
    }
};

export const addSavedCard = (card: Omit<SavedCard, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
    const cards = getSavedCards();
    const newCard: SavedCard = {
        id: Date.now().toString(),
        last4: card.last4,
        expiry: card.expiry,
        brand: card.brand,
        isDefault: card.isDefault ?? cards.length === 0,
    };

    const nextCards = newCard.isDefault
        ? [newCard, ...cards.map((item) => ({ ...item, isDefault: false }))]
        : [...cards, newCard];

    saveSavedCards(nextCards);
    return newCard;
};

export const deleteSavedCard = (cardId: string) => {
    const updated = getSavedCards().filter((card) => card.id !== cardId);

    if (updated.length > 0 && !updated.some((card) => card.isDefault)) {
        updated[0] = { ...updated[0], isDefault: true };
    }

    saveSavedCards(updated);
    return updated;
};

export const getDefaultSavedCard = (): SavedCard | null => {
    const cards = getSavedCards();
    return cards.find((card) => card.isDefault) ?? cards[0] ?? null;
};

export const getLoyaltyPoints = (): number => {
    try {
        const raw = localStorage.getItem(LOYALTY_KEY);
        if (!raw) return 0;
        const value = Number(raw);
        return Number.isFinite(value) ? value : 0;
    } catch {
        return 0;
    }
};

export const addLoyaltyPoints = (amount: number): number => {
    const next = getLoyaltyPoints() + amount;
    try {
        localStorage.setItem(LOYALTY_KEY, String(next));
    } catch {
        // ignore
    }
    return next;
};

export const calculatePromoDiscount = (total: number, percent: number) =>
    Math.round(total * (percent / 100));

export const applyPromoToTotal = (total: number, promo: AppliedPromo | null) => {
    if (!promo) {
        return { total, promoDiscount: 0 };
    }

    const promoDiscount = calculatePromoDiscount(total, promo.percent);
    return {
        total: Math.max(0, total - promoDiscount),
        promoDiscount,
    };
};
