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



    const [scrollCompact, setScrollCompact] = useState(
        () => typeof window !== 'undefined' && window.scrollY >= SCROLL_COMPACT_AT,
    );

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

    const [prevDefaults, setPrevDefaults] = useState({
        defaultLocation,
        defaultDates,
        defaultGuests,
    });

    if (
        defaultLocation !== prevDefaults.defaultLocation
        || defaultDates !== prevDefaults.defaultDates
        || defaultGuests !== prevDefaults.defaultGuests
    ) {
        setPrevDefaults({ defaultLocation, defaultDates, defaultGuests });
        setSearchSummary((prev) => ({
            location: prev.location === prevDefaults.defaultLocation ? defaultLocation : prev.location,
            dates: prev.dates === prevDefaults.defaultDates ? defaultDates : prev.dates,
            guests: prev.guests === prevDefaults.defaultGuests ? defaultGuests : prev.guests,
        }));
    }

    const [wasFixedCompact, setWasFixedCompact] = useState(fixedCompactSearch);

    if (fixedCompactSearch !== wasFixedCompact) {
        setWasFixedCompact(fixedCompactSearch);
        if (fixedCompactSearch) {
            isCompactRef.current = true;
            setIsExpanded(false);
            setAllowDropdownOverflow(false);
        }
    }

    const isScrolled = fixedCompactSearch || scrollCompact;

    const setCompactMode = useCallback((compact: boolean) => {
        if (isCompactRef.current === compact) return;
        isCompactRef.current = compact;
        setScrollCompact(compact);
        if (compact) setIsExpanded(false);
    }, []);

    useEffect(() => {
        if (fixedCompactSearch) {
            isCompactRef.current = true;
            return;
        }

        const updateSticky = () => {
            setCompactMode(window.scrollY >= SCROLL_COMPACT_AT);
        };

        window.addEventListener('scroll', updateSticky, { passive: true });
        const frame = window.requestAnimationFrame(updateSticky);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', updateSticky);
        };
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

    if (!showBigSearch && allowDropdownOverflow) {
        setAllowDropdownOverflow(false);
    }

    if (showBigSearch && (isExpanded || isMobile) && !allowDropdownOverflow) {
        setAllowDropdownOverflow(true);
    }

    useEffect(() => {
        if (!showBigSearch || isExpanded || isMobile) return;

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

    const navState = locationState as { openSearch?: boolean } | null;
    const wantsOpenSearch = Boolean(navState?.openSearch && showSearch);
    const [openSearchHandled, setOpenSearchHandled] = useState(false);

    if (wantsOpenSearch && !openSearchHandled) {
        setOpenSearchHandled(true);
        if (isMobile) {
            setMobileSearch({ isOpen: true, step: 'location' });
        } else {
            setIsExpanded(true);
            setAllowDropdownOverflow(true);
        }
    }

    if (!wantsOpenSearch && openSearchHandled) {
        setOpenSearchHandled(false);
    }

    useEffect(() => {
        if (!navState?.openSearch || !showSearch) return;
        navigate(pathname, { replace: true, state: null });
    }, [locationState, showSearch, navigate, pathname, navState?.openSearch]);



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


