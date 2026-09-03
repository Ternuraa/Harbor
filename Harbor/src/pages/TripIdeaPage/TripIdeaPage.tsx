import React from 'react';

import { useParams, Navigate } from 'react-router-dom';

import { TripIdeaArticle } from './components/TripIdeaArticle/TripIdeaArticle';

import { getTravelIdeaBySlug } from '../../i18n/travelIdeas/index';

import { useTranslation } from '../../i18n/useTranslation';

import { PageLayout } from '../../components/layout/PageLayout/PageLayout';

export const TripIdeaPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { language } = useTranslation();

    if (!slug) {
        return <Navigate to="/" replace />;
    }

    const idea = getTravelIdeaBySlug(slug, language);

    if (!idea) {
        return <Navigate to="/" replace />;
    }

    return (
        <PageLayout container="flush">
            <TripIdeaArticle idea={idea} />
        </PageLayout>
    );
};
