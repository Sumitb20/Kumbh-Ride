import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { PWAProvider } from './context/PWAContext';
import { MobileLayout } from './layouts/MobileLayout';
import { HomePage } from './pages/HomePage';
import { RideBookingPage } from './pages/RideBookingPage';
import { HotelDiscoveryPage } from './pages/HotelDiscoveryPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <BookingProvider>
          <PWAProvider>
            <Routes>
              <Route element={<MobileLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/rides" element={<RideBookingPage />} />
                <Route path="/hotels" element={<HotelDiscoveryPage />} />
                <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
                <Route path="/bookings" element={<MyBookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </PWAProvider>
        </BookingProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

