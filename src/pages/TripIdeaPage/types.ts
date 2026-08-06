export interface TravelIdeaDestination {
    name: string;
    country: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    visaInfo?: string;
    bestSeason?: string;
    priceFrom?: string;
}

export interface TravelIdeaContentBlock {
    type: 'paragraph' | 'heading' | 'list' | 'image' | 'destinations';
    text?: string;
    items?: string[];
    imageUrl?: string;
    imageAlt?: string;
    caption?: string;
    destinations?: TravelIdeaDestination[];
}

export interface TravelIdea {
    slug: string;
    title: string;
    cardTitle: string;
    readTime: string;
    publishedAt: string;
    imageUrl: string;
    heroImage: string;
    heroImageAlt: string;
    lead: string;
    searchQuery?: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    blocks: TravelIdeaContentBlock[];
}
