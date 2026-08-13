import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { SearchBar } from './SearchBar';

import { UserMenu } from './UserMenu';

import { CompactSearchWidget } from '../../features/search/SearchWidget/CompactSearchWidget';

import { MobileSearchFlow, type MobileSearchStep } from '../../features/search/MobileSearchFlow/MobileSearchFlow';

import { useIsMobile } from '../../../hooks/useIsMobile';

import styles from './Header.module.scss';

import { useTranslation } from '../../../i18n/useTranslation';



interface HeaderProps {

    showSearch?: boolean;

}



const SCROLL_COMPACT_AT = 1;

const SEARCH_MOTION_MS = 450;



export const Header: React.FC<HeaderProps> = ({ showSearch = true }) => {

    const { pathname, state: locationState } = useLocation();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const isMobile = useIsMobile();

    const isHomePage = pathname === '/';

    const fixedCompactSearch = showSearch && !isHomePage && !isMobile;



    const defaultLocation = t('header.where');

    const defaultDates = t('header.when');

    const defaultGuests = t('header.who');



    const [isScrolled, setIsScrolled] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    const [allowDropdownOverflow, setAllowDropdownOverflow] = useState(false);

    const [mobileSearch, setMobileSearch] = useState<{ isOpen: boolean; step: MobileSearchStep }>({
        isOpen: false,
        step: 'location',
    });

    const isCompactRef = useRef(false);



    const [searchSummary, setSearchSummary] = useState({

        location: defaultLocation,

        dates: defaultDates,

        guests: defaultGuests,

    });



    useEffect(() => {

        setSearchSummary((prev) => ({

            location: prev.location === defaultLocation ? defaultLocation : prev.location,

            dates: prev.dates === defaultDates ? defaultDates : prev.dates,

            guests: prev.guests === defaultGuests ? defaultGuests : prev.guests,

        }));

    }, [defaultLocation, defaultDates, defaultGuests]);



    const setCompactMode = useCallback((compact: boolean) => {

        if (isCompactRef.current === compact) return;

        isCompactRef.current = compact;

        setIsScrolled(compact);

        if (compact) setIsExpanded(false);

    }, []);



    useEffect(() => {
        if (fixedCompactSearch) {
            isCompactRef.current = true;
            setIsScrolled(true);
            setIsExpanded(false);
            setAllowDropdownOverflow(false);
            return;
        }

        if (isMobile && showSearch) {
            const updateSticky = () => {
                const sticky = window.scrollY >= SCROLL_COMPACT_AT;
                if (isCompactRef.current === sticky) return;
                isCompactRef.current = sticky;
                setIsScrolled(sticky);
            };

            updateSticky();
            setAllowDropdownOverflow(true);

            window.addEventListener('scroll', updateSticky, { passive: true });
            return () => window.removeEventListener('scroll', updateSticky);
        }

        const initialCompact = window.scrollY >= SCROLL_COMPACT_AT;
        isCompactRef.current = initialCompact;
        setIsScrolled(initialCompact);
        setAllowDropdownOverflow(!initialCompact);

        const handleScroll = () => {
            setCompactMode(window.scrollY >= SCROLL_COMPACT_AT);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fixedCompactSearch, isMobile, isHomePage, showSearch, setCompactMode]);



    const showBigSearch = isMobile
        ? showSearch
        : fixedCompactSearch
            ? isExpanded
            : !isScrolled || isExpanded;

    const showCompactSearch = isMobile
        ? false
        : fixedCompactSearch
            ? !isExpanded
            : isScrolled && !isExpanded;

    const pinHeader = isScrolled || fixedCompactSearch;

    const expandedSlotOpen = showBigSearch && (isExpanded || allowDropdownOverflow);



    useEffect(() => {
        if (!showBigSearch) {
            setAllowDropdownOverflow(false);
            return;
        }

        if (isExpanded || isMobile) {
            setAllowDropdownOverflow(true);
            return;
        }

        const timer = window.setTimeout(() => {
            setAllowDropdownOverflow(true);
        }, SEARCH_MOTION_MS);

        return () => window.clearTimeout(timer);
    }, [showBigSearch, isExpanded, isMobile]);



    useEffect(() => {

        document.body.style.overflow = (isExpanded && !isMobile) || mobileSearch.isOpen ? 'hidden' : '';

        return () => {

            document.body.style.overflow = '';

        };

    }, [isExpanded, isMobile, mobileSearch.isOpen]);



    const openMobileSearch = useCallback((step: MobileSearchStep = 'location') => {
        setMobileSearch({ isOpen: true, step });
    }, []);

    const closeMobileSearch = () => setMobileSearch((current) => ({ ...current, isOpen: false }));

    const handleOpenSearch = useCallback(() => {
        if (!showSearch) {
            navigate('/', { state: { openSearch: true } });
            return;
        }

        if (isMobile) {
            openMobileSearch('location');
            return;
        }

        setIsExpanded(true);
        setAllowDropdownOverflow(true);
    }, [showSearch, isMobile, navigate, openMobileSearch]);

    useEffect(() => {
        const state = locationState as { openSearch?: boolean } | null;
        if (!state?.openSearch || !showSearch) return;

        if (isMobile) {
            openMobileSearch('location');
        } else {
            setIsExpanded(true);
            setAllowDropdownOverflow(true);
        }

        navigate(pathname, { replace: true, state: null });
    }, [locationState, showSearch, isMobile, navigate, pathname, openMobileSearch]);



    const displayLocation =

        searchSummary.location !== defaultLocation

            ? searchSummary.location

            : t('header.anyPlace');

    const displayDates =

        searchSummary.dates !== defaultDates

            ? searchSummary.dates

            : t('header.anyWeek');

    const displayGuests =

        searchSummary.guests !== defaultGuests

            ? searchSummary.guests

            : t('header.addGuests');



    const headerModeClass = showBigSearch ? styles.modeExpanded : styles.modeCompact;



    return (

        <>

            <header className={`${styles.header} ${pinHeader ? styles.headerPinned : ''} ${showSearch ? headerModeClass : ''} ${fixedCompactSearch ? styles.searchStatic : ''} ${isMobile && showSearch ? styles.searchMobileStatic : ''}`}>

                <div className={styles.topRow}>

                    <Link to="/" style={{ textDecoration: 'none' }}>

                        <div className={styles.headerLogo}>

                            <span className={styles.logoText}>Харбор</span>

                        </div>

                    </Link>



                    {showSearch && (

                        <div

                            className={styles.compactSearchWrapper}

                            aria-hidden={!showCompactSearch}

                        >

                            <div className={styles.compactSearchInner}>

                                <CompactSearchWidget

                                    location={displayLocation}

                                    dates={displayDates}

                                    guests={displayGuests}

                                    onClick={handleOpenSearch}

                                />

                            </div>

                        </div>

                    )}



                    <UserMenu onOpenSearch={handleOpenSearch} />

                </div>



                {showSearch && (

                    <div

                        className={`${styles.expandedSlot} ${showBigSearch ? styles.expandedSlotVisible : ''} ${expandedSlotOpen ? styles.expandedSlotOpen : ''}`}

                        aria-hidden={!showBigSearch}

                    >

                        <div className={styles.expandedLayer}>

                            <div className={styles.expandedInner}>

                                <SearchBar
                                    onSummaryChange={setSearchSummary}
                                    onMobileSegmentClick={isMobile ? openMobileSearch : undefined}
                                />

                            </div>

                        </div>

                    </div>

                )}

            </header>



            {showSearch && isExpanded && isScrolled && !isMobile && (

                <div className={styles.overlay} onClick={() => setIsExpanded(false)} />

            )}



            {showSearch && (

                <MobileSearchFlow

                    isOpen={mobileSearch.isOpen}

                    initialStep={mobileSearch.step}

                    onClose={closeMobileSearch}

                    onSummaryChange={setSearchSummary}

                />

            )}

        </>

    );

};


