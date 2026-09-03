import React from 'react';

import { Link } from 'react-router-dom';

import styles from './TravelIdeas.module.scss';

import { Badge } from '../../../components/ui/Badge/Badge';

import { getTravelIdeas } from '../../../i18n/travelIdeas/index';

import { markTravelIdeasReturn, TRAVEL_IDEAS_SECTION_ID } from '../../../utils/travelIdeasScroll';

import { useTranslation } from '../../../i18n/useTranslation';



export const TravelIdeas: React.FC = () => {

    const { dictionary, language } = useTranslation();

    const home = dictionary.home;

    const travelIdeas = getTravelIdeas(language);



    return (

        <section id={TRAVEL_IDEAS_SECTION_ID} className={styles.section}>

            <div className={styles.container}>

                <h2 className={styles.sectionTitle}>{home.travelIdeas}</h2>



                <div className={styles.grid}>

                    {travelIdeas.map((idea) => (

                        <Link

                            key={idea.slug}

                            to={`/ideas/${idea.slug}`}

                            className={styles.card}

                            onClick={markTravelIdeasReturn}

                        >

                            <img src={idea.imageUrl} alt={idea.title} className={styles.image} />



                            <div className={styles.overlay} />



                            <Badge

                                text={home.travelIdeas}

                                variant="ideas"

                                className={styles.cardBadge}

                            />



                            <h3 className={styles.cardTitle}>

                                {home.travelIdeaTitles[idea.slug] ?? idea.cardTitle}

                            </h3>

                        </Link>

                    ))}

                </div>

            </div>

        </section>

    );

};

