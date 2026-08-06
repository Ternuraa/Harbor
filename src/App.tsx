import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { PropertyDetailsPage } from './pages/PropertyDetails/components/PropertyDetailsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import './App.scss';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SearchProvider } from './context/SearchContext';
import { SearchResultsPage } from './pages/SearchResultsPage/SearchResultsPage';
import { TripIdeaPage } from './pages/TripIdeaPage/TripIdeaPage';
import { HomePage } from './pages/HomePage/HomePage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { PrivacyPage } from './pages/PrivacyPage/PrivacyPage';
import { TermsPage } from './pages/TermsPage/TermsPage';
import { SitemapPage } from './pages/SitemapPage/SitemapPage';
import { AboutPage } from './pages/AboutPage/AboutPage';
import { NewsPage } from './pages/NewsPage/NewsPage';
import { NewsArticlePage } from './pages/NewsPage/NewsArticlePage';
import { CancellationPolicyPage } from './pages/CancellationPolicyPage/CancellationPolicyPage';
import { GuestSafetyPage } from './pages/GuestSafetyPage/GuestSafetyPage';
import { ContactPage } from './pages/ContactPage/ContactPage';
import { ListYourSpacePage } from './pages/ListYourSpacePage/ListYourSpacePage';
import { HostProtectionPage } from './pages/HostProtectionPage/HostProtectionPage';
import { HostResourcesPage } from './pages/HostResourcesPage/HostResourcesPage';
import { BookingRequestPage } from './pages/BookingRequestPage/BookingRequestPage';
import { UiKitPage } from './pages/UiKitPage/UiKitPage';
import { AppShell } from './components/layout/AppShell/AppShell';
import { MainLayout } from './components/layout/MainLayout/MainLayout';

export const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
            <SearchProvider>
                <FavoritesProvider>
                    <AppShell>
                    <div className="main-screen">
                        <Routes>
                            <Route element={<MainLayout showSearch />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/search" element={<SearchResultsPage />} />
                                <Route path="/ideas/:slug" element={<TripIdeaPage />} />
                                <Route path="/favorites" element={<FavoritesPage />} />
                                <Route path="/privacy" element={<PrivacyPage />} />
                                <Route path="/terms" element={<TermsPage />} />
                                <Route path="/sitemap" element={<SitemapPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/news" element={<NewsPage />} />
                                <Route path="/news/:slug" element={<NewsArticlePage />} />
                                <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
                                <Route path="/guest-safety" element={<GuestSafetyPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/list-your-space" element={<ListYourSpacePage />} />
                                <Route path="/host-protection" element={<HostProtectionPage />} />
                                <Route path="/host-resources" element={<HostResourcesPage />} />
                            </Route>

                            <Route element={<MainLayout showSearch={false} />}>
                                <Route path="/property/:id" element={<PropertyDetailsPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/ui-kit" element={<UiKitPage />} />
                            </Route>

                            <Route element={<MainLayout showSearch={false} showFooter={false} />}>
                                <Route path="/property/:id/book" element={<BookingRequestPage />} />
                            </Route>

                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                    </div>
                    </AppShell>
                </FavoritesProvider>
            </SearchProvider>
        </AuthProvider>
        </LanguageProvider>
    );
};

export default App;
