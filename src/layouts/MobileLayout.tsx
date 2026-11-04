import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { PWAInstallPrompt } from '../components/common/PWAInstallPrompt';

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-kumbh-cream flex flex-col">
      <OfflineBanner />
      <Header />
      <main className="flex-1 pb-20 md:pb-4">
        <Outlet />
      </main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
}

