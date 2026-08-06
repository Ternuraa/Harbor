import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { SearchBar } from './SearchBar';

import { UserMenu } from './UserMenu';

import { CompactSearchWidget } from '../SearchWidget/CompactSearchWidget';

import styles from './Header.module.scss';

import { useTranslation } from '../../i18n/useTranslation';



interface HeaderProps {

    showSearch?: boolean;

}



const SCROLL_COMPACT_AT = 80;

const SEARCH_MOTION_MS = 450;



export const Header: React.FC<HeaderProps> = ({ showSearch = true }) => {

    const { pathname } = useLocation();

    const { t } = useTranslation();

    const isHomePage = pathname === '/';

    const fixedCompactSearch = showSearch && !isHomePage;



    const defaultLocation = t('header.where');

    const defaultDates = t('header.when');

    const defaultGuests = t('header.who');



    const [isScrolled, setIsScrolled] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    const [allowDropdownOverflow, setAllowDropdownOverflow] = useState(false);

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



        const initialCompact = window.scrollY >= SCROLL_COMPACT_AT;

        isCompactRef.current = initialCompact;

        setIsScrolled(initialCompact);

        setAllowDropdownOverflow(!initialCompact);



        const handleScroll = () => {

            setCompactMode(window.scrollY >= SCROLL_COMPACT_AT);

        };



        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);

    }, [fixedCompactSearch, setCompactMode]);



    const showBigSearch = fixedCompactSearch ? isExpanded : !isScrolled || isExpanded;

    const showCompactSearch = fixedCompactSearch ? !isExpanded : isScrolled && !isExpanded;



    useEffect(() => {

        if (!showBigSearch) {

            setAllowDropdownOverflow(false);

            return;

        }



        const timer = window.setTimeout(() => {

            setAllowDropdownOverflow(true);

        }, SEARCH_MOTION_MS);



        return () => window.clearTimeout(timer);

    }, [showBigSearch]);



    useEffect(() => {

        document.body.style.overflow = isExpanded ? 'hidden' : '';

        return () => {

            document.body.style.overflow = '';

        };

    }, [isExpanded]);



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

            <header className={`${styles.header} ${showSearch ? headerModeClass : ''} ${fixedCompactSearch ? styles.searchStatic : ''}`}>

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

                                    onClick={() => setIsExpanded(true)}

                                />

                            </div>

                        </div>

                    )}



                    <UserMenu />

                </div>



                {showSearch && (

                    <div

                        className={`${styles.expandedSlot} ${allowDropdownOverflow ? styles.expandedSlotOpen : ''}`}

                        aria-hidden={!showBigSearch}

                    >

                        <div className={styles.expandedLayer}>

                            <div className={styles.expandedInner}>

                                <SearchBar onSummaryChange={setSearchSummary} />

                            </div>

                        </div>

                    </div>

                )}

            </header>



            {showSearch && isExpanded && isScrolled && (

                <div className={styles.overlay} onClick={() => setIsExpanded(false)} />

            )}

        </>

    );

};


