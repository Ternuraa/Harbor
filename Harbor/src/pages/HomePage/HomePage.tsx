import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PropertiesSection } from '../../components/blocks/PropertiesSection/PropertiesSection';
import { PopularDestinations } from '../../components/blocks/PopularDestinations/PopularDestinations';
import { TravelIdeas } from '../../components/blocks/TravelIdeas/TravelIdeas';
import { HostEarnBanner } from '../../components/blocks/HostEarnBanner/HostEarnBanner';
import { HostBenefits } from '../../components/blocks/HostBenefits/HostBenefits';
import {
    shouldScrollToTravelIdeas,
    scrollToTravelIdeasSection,
    TRAVEL_IDEAS_SECTION_ID,
} from '../../utils/travelIdeasScroll';

export const HomePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!shouldScrollToTravelIdeas(location.state)) return;

        if ((location.state as { scrollTo?: string } | null)?.scrollTo === TRAVEL_IDEAS_SECTION_ID) {
            navigate('.', { replace: true, state: null });
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollToTravelIdeasSection();
            });
        });
    }, [location.key, location.state, navigate]);

    return (
        <main id="main-content" className="home-main">
            <PropertiesSection />
            <PopularDestinations />
            <TravelIdeas />
            <HostEarnBanner />
            <HostBenefits />
        </main>
    );
};
