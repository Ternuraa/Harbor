import React from 'react';

import { useParams } from 'react-router-dom';

import { PropertyDetails } from './PropertyDetails';

import styles from './PropertyDetails.module.scss';
import { PageLayout } from '../../../components/layout/PageLayout/PageLayout';

import { useTranslation } from '../../../i18n/useTranslation';

import { localizeProperty } from '../../../utils/localizeProperty';
import { useDbRevision, usePropertyFromDb } from '../../../utils/loadProperties';



export const PropertyDetailsPage: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const { t, language } = useTranslation();



    const dbRevision = useDbRevision();
    const numericId = Number(id);
    const rawProperty = usePropertyFromDb(Number.isFinite(numericId) ? numericId : -1);
    const property = rawProperty ? localizeProperty(rawProperty, language) : undefined;



    if (!property) {

        return (
            <PageLayout container="narrow">
                <p className={styles.notFound}>{t('property.notFound')}</p>
            </PageLayout>
        );

    }



    return (
        <PropertyDetails
            key={`property-${property.id}-${dbRevision}`}
            property={property}
        />
    );
};

