import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TravelIdea, TravelIdeaContentBlock, TravelIdeaDestination } from '../../types';
import { Badge } from '../../../../components/ui/Badge/Badge';
import { Button } from '../../../../components/ui/Button/Button';
import { BackButton } from '../../../../components/ui/BackButton/BackButton';
import { useTranslation } from '../../../../i18n/useTranslation';
import styles from './TripIdeaArticle.module.scss';
import { TRAVEL_IDEAS_SECTION_ID } from '../../../../utils/travelIdeasScroll';

interface TripIdeaArticleProps {
    idea: TravelIdea;
}

const renderDestination = (
    destination: TravelIdeaDestination,
    labels: { bestSeason: string; priceFrom: string; visaInfo: string },
) => (
    <section key={destination.name} className={styles.destination}>
        <h3 className={styles.destinationTitle}>{destination.name}</h3>

        <figure className={styles.destinationImage}>
            <img
                src={destination.imageUrl}
                alt={destination.imageAlt}
                loading="lazy"
            />
        </figure>

        <p className={styles.destinationText}>{destination.description}</p>

        <div className={styles.destinationMeta}>
            {destination.bestSeason && (
                <p>
                    <strong>{labels.bestSeason}</strong> {destination.bestSeason}
                </p>
            )}
            {destination.priceFrom && (
                <p>
                    <strong>{labels.priceFrom}</strong> {destination.priceFrom}
                </p>
            )}
            {destination.visaInfo && (
                <p>
                    <strong>{labels.visaInfo}</strong> {destination.visaInfo}
                </p>
            )}
        </div>
    </section>
);

const renderBlock = (
    block: TravelIdeaContentBlock,
    index: number,
    labels: { bestSeason: string; priceFrom: string; visaInfo: string },
) => {
    switch (block.type) {
        case 'paragraph':
            return <p key={index}>{block.text}</p>;

        case 'heading':
            return <h2 key={index}>{block.text}</h2>;

        case 'list':
            return (
                <ul key={index}>
                    {block.items?.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            );

        case 'image':
            return (
                <figure key={index} className={styles.articleImage}>
                    <img src={block.imageUrl} alt={block.imageAlt ?? ''} />
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
            );

        case 'destinations':
            return (
                <div key={index} className={styles.destinations}>
                    {block.destinations?.map((destination) =>
                        renderDestination(destination, labels),
                    )}
                </div>
            );

        default:
            return null;
    }
};

export const TripIdeaArticle: React.FC<TripIdeaArticleProps> = ({ idea }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const destinationLabels = {
        bestSeason: t('tripIdea.bestSeason'),
        priceFrom: t('tripIdea.priceFrom'),
        visaInfo: t('tripIdea.visaInfo'),
    };

    const handleSearch = () => {
        const query = idea.searchQuery
            ? `?city=${encodeURIComponent(idea.searchQuery)}`
            : '';
        navigate(`/search${query}`);
    };

    return (
        <article className={styles.article}>
            <BackButton
                className={styles.backButton}
                onClick={() => navigate('/', { state: { scrollTo: TRAVEL_IDEAS_SECTION_ID } })}
            >
                {t('tripIdea.backToIdeas')}
            </BackButton>

            <header className={styles.articleHeader}>
                <Badge text={t('tripIdea.categoryBadge')} variant="ideasTag" className={styles.categoryBadge} />
                <h1 className={styles.title}>{idea.title}</h1>
                <p className={styles.meta}>
                    {t('tripIdea.readTime')} {idea.readTime} • {t('tripIdea.publishedAt')} {idea.publishedAt}
                </p>
            </header>

            <div className={styles.heroImageWrapper}>
                <img
                    src={idea.heroImage}
                    alt={idea.heroImageAlt}
                    className={styles.heroImage}
                />
            </div>

            <div className={styles.articleBody}>
                <p className={styles.lead}>{idea.lead}</p>
                {idea.blocks.map((block, index) => renderBlock(block, index, destinationLabels))}

                <section className={styles.cta}>
                    <h3>{idea.ctaTitle}</h3>
                    <p>{idea.ctaText}</p>
                    <Button className={styles.ctaButton} onClick={handleSearch}>
                        {idea.ctaButton}
                    </Button>
                </section>
            </div>
        </article>
    );
};
