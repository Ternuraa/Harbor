import type { Language } from '../types';
import type { TravelIdea } from '../../pages/TripIdeaPage/types';
import { ruTravelIdeas } from './ru';
import { enTravelIdeas } from './en';

export const getTravelIdeas = (language: Language): TravelIdea[] =>
    language === 'en' ? enTravelIdeas : ruTravelIdeas;

export const getTravelIdeaBySlug = (slug: string, language: Language): TravelIdea | undefined =>
    getTravelIdeas(language).find((idea) => idea.slug === slug);
