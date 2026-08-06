import React, { useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import styles from './PropertyDetails.module.scss';
import { PageLayout } from '../../../components/layout/PageLayout/PageLayout';

import { ReservationCard, type ReservationCardHandle } from './ReservationCard/ReservationCard';

import { ImageGallery } from './ImageGallery/ImageGallery';

import { ReviewsSection } from '../../../components/blocks/ReviewsSection/ReviewsSection';

import { LocationSection } from '../../../components/blocks/LocationSection/LocationSection';

import { BackButton } from '../../../components/ui/BackButton/BackButton';

import { useSearch } from '../../../context/SearchContext';

import { useTranslation } from '../../../i18n/useTranslation';

import { getLocaleForNumber } from '../../../utils/localizeProperty';

import type { Property } from '../../../types/property';



export const PropertyDetails: React.FC<{ property: Property }> = ({ property }) => {

    const navigate = useNavigate();

    const location = useLocation();

    const { t, language } = useTranslation();

    const { buildSearchUrl, city, checkIn, checkOut, guests, buildPropertyUrl, setPropertyBookedDates } = useSearch();

    const { adults, children, infants, pets } = guests;

    const locale = getLocaleForNumber(language);

    const formattedRating = language === 'en'

        ? property.rating.toString()

        : property.rating.toString().replace('.', ',');



    const navigationState = location.state as { from?: string } | null;

    const fromFavorites = navigationState?.from === 'favorites';
    const fromTrips = navigationState?.from === 'trips';
    const fromSearch = navigationState?.from === 'search';



    const reservationRef = useRef<ReservationCardHandle>(null);

    const handleBookNow = () => {
        reservationRef.current?.handleReserve();
    };

    useEffect(() => {

        const nextUrl = buildPropertyUrl(property.id);

        if (`${location.pathname}${location.search}` !== nextUrl) {

            navigate(nextUrl, { replace: true, state: location.state });

        }

    }, [

        city,

        checkIn,

        checkOut,

        adults,

        children,

        infants,

        pets,

        property.id,

        buildPropertyUrl,

        navigate,

        location.pathname,

        location.search,

    ]);



    useEffect(() => {
        setPropertyBookedDates(property.bookedDates);
        return () => setPropertyBookedDates(null);
    }, [property.bookedDates, setPropertyBookedDates]);



    const handleBack = () => {
        if (fromFavorites) {
            navigate('/favorites');
            return;
        }

        if (fromTrips) {
            navigate('/profile');
            localStorage.setItem('profileActiveTab', 'trips');
            return;
        }

        if (fromSearch) {
            navigate(buildSearchUrl());
            return;
        }

        navigate('/');
    };



    return (
        <PageLayout>
            <BackButton className={styles.backButton} onClick={handleBack}>
                {fromFavorites
                    ? t('property.backToFavorites')
                    : fromTrips
                        ? t('property.backToTrips')
                        : fromSearch
                            ? t('property.backToSearch')
                            : t('property.backToHome')}
            </BackButton>

            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{property.title}</h1>
                <div className={styles.meta}>
                    <span className={styles.rating}>★ {formattedRating}</span>
                    <span className={styles.reviewsCount}>
                        {property.reviewsCount.toLocaleString(locale)} {t('property.reviews')}
                    </span>
                    <span className={styles.divider}>•</span>
                    <a href="#map" className={styles.locationLink}>{property.location}</a>
                </div>
            </header>

            <ImageGallery images={property.images} title={property.title} onBookNow={handleBookNow} />

            <div className={styles.grid}>
                <div className={styles.mainContent}>

                    <div className={styles.hostSection}>

                        <div className={styles.infoText}>

                            <h2 className={styles.roomType}>
                                {property.roomType ?? t('property.roomType')}
                            </h2>

                            <p className={styles.roomDetails}>
                                {property.roomDetails ?? t('property.roomDetails')}
                            </p>

                        </div>

                        <img src={property.host.avatar} alt={property.host.name} className={styles.hostAvatar} />

                    </div>



                    <hr className={styles.dividerLine} />



                    <div className={styles.descriptionSection}>

                        <p className={styles.descriptionText}>{property.description}</p>

                    </div>



                    <hr className={styles.dividerLine} />



                    <div className={styles.amenitiesSection}>

                        <h2 className={styles.sectionTitle}>{t('property.amenitiesTitle')}</h2>

                        <div className={styles.amenitiesGrid}>

                            {property.amenities.map((item, index) => (

                                <div key={index} className={styles.amenityItem}>

                                    <span className={styles.icon}>{item.icon}</span>

                                    {item.name}

                                </div>

                            ))}

                        </div>

                    </div>



                    <hr className={styles.dividerLine} />



                    <div className={styles.aboutHostSection}>

                        <h2 className={styles.sectionTitle}>{t('property.hostTitle')} {property.host.name}</h2>

                        <p className={styles.descriptionText}>{property.host.about}</p>

                    </div>



                    <hr className={styles.dividerLine} />



                    <ReviewsSection rating={property.rating} reviewsCount={property.reviewsCount} />

                    <LocationSection locationDetails={property.locationDetails} />
                </div>

                <aside className={styles.sidebar}>

                    <ReservationCard
                        ref={reservationRef}
                        propertyId={property.id}

                        pricePerNight={property.pricePerNight}

                        bookedDates={property.bookedDates}

                        noCommission={property.noCommission}

                    />

                </aside>
            </div>
        </PageLayout>
    );

};

