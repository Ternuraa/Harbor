export interface FavoritePropertyMeta {
    title: string;
    imageUrl: string;
}

export interface FavoritesModalState {
    isOpen: boolean;
    propertyId: number | null;
    propertyTitle: string;
    propertyImageUrl: string;
}
