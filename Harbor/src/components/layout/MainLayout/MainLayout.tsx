import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

type MainLayoutProps = {
    showSearch?: boolean;
    showFooter?: boolean;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
    showSearch = true,
    showFooter = true,
}) => (
    <>
        <Header showSearch={showSearch} />
        <Outlet />
        {showFooter && <Footer />}
    </>
);
