import peaksCard from '../../assets/images/trip-ideas/peaks-to-conquer/card.webp';
import peaksHero from '../../assets/images/trip-ideas/peaks-to-conquer/hero.webp';
import peaksInline from '../../assets/images/trip-ideas/peaks-to-conquer/inline.webp';
import peaksAltai from '../../assets/images/trip-ideas/peaks-to-conquer/destinations/altai.webp';
import peaksDombay from '../../assets/images/trip-ideas/peaks-to-conquer/destinations/dombay.webp';
import peaksKazbek from '../../assets/images/trip-ideas/peaks-to-conquer/destinations/kazbek.webp';
import peaksDolomites from '../../assets/images/trip-ideas/peaks-to-conquer/destinations/dolomites.webp';

import secludedCard from '../../assets/images/trip-ideas/secluded-corners/card.webp';
import secludedHero from '../../assets/images/trip-ideas/secluded-corners/hero.webp';
import secludedInline from '../../assets/images/trip-ideas/secluded-corners/inline.webp';
import secludedKarelia from '../../assets/images/trip-ideas/secluded-corners/destinations/karelia.webp';
import secludedSeliger from '../../assets/images/trip-ideas/secluded-corners/destinations/seliger.webp';
import secludedKabardinka from '../../assets/images/trip-ideas/secluded-corners/destinations/kabardinka.webp';
import secludedSvaneti from '../../assets/images/trip-ideas/secluded-corners/destinations/svaneti.webp';

import seaCard from '../../assets/images/trip-ideas/sea-breeze/card.webp';
import seaHero from '../../assets/images/trip-ideas/sea-breeze/hero.webp';
import seaInline from '../../assets/images/trip-ideas/sea-breeze/inline.webp';
import seaAbkhazia from '../../assets/images/trip-ideas/sea-breeze/destinations/abkhazia.webp';
import seaBatumi from '../../assets/images/trip-ideas/sea-breeze/destinations/batumi.webp';
import seaCrimea from '../../assets/images/trip-ideas/sea-breeze/destinations/crimea.webp';
import seaTurkey from '../../assets/images/trip-ideas/sea-breeze/destinations/turkey.webp';

import tropicalCard from '../../assets/images/trip-ideas/tropical-paradise/card.webp';
import tropicalHero from '../../assets/images/trip-ideas/tropical-paradise/hero.webp';
import tropicalInline from '../../assets/images/trip-ideas/tropical-paradise/inline.webp';
import tropicalThailand from '../../assets/images/trip-ideas/tropical-paradise/destinations/thailand.webp';
import tropicalVietnam from '../../assets/images/trip-ideas/tropical-paradise/destinations/vietnam.webp';
import tropicalSrilanka from '../../assets/images/trip-ideas/tropical-paradise/destinations/srilanka.webp';
import tropicalUae from '../../assets/images/trip-ideas/tropical-paradise/destinations/uae.webp';

export const tripIdeaImages = {
    'peaks-to-conquer': {
        card: peaksCard,
        hero: peaksHero,
        inline: peaksInline,
    },
    'secluded-corners': {
        card: secludedCard,
        hero: secludedHero,
        inline: secludedInline,
    },
    'sea-breeze': {
        card: seaCard,
        hero: seaHero,
        inline: seaInline,
    },
    'tropical-paradise': {
        card: tropicalCard,
        hero: tropicalHero,
        inline: tropicalInline,
    },
} as const;

export const destinationImages = {
    'peaks-to-conquer': {
        altai: peaksAltai,
        dombay: peaksDombay,
        kazbek: peaksKazbek,
        dolomites: peaksDolomites,
    },
    'secluded-corners': {
        karelia: secludedKarelia,
        seliger: secludedSeliger,
        kabardinka: secludedKabardinka,
        svaneti: secludedSvaneti,
    },
    'sea-breeze': {
        abkhazia: seaAbkhazia,
        batumi: seaBatumi,
        crimea: seaCrimea,
        turkey: seaTurkey,
    },
    'tropical-paradise': {
        thailand: tropicalThailand,
        vietnam: tropicalVietnam,
        srilanka: tropicalSrilanka,
        uae: tropicalUae,
    },
} as const;

export type TripIdeaSlug = keyof typeof tripIdeaImages;
