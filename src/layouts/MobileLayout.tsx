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
      <footer className="hidden md:block py-5 bg-white border-t border-orange-100 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <p>© 2028 कुंभ Ride • Simhastha Kumbh Mela Nashik–Trimbakeshwar</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              An Initiative by
            </span>
            <img src="./buildtek-logo.png" alt="BuildTek Events" className="h-5 object-contain" />
          </div>
        </div>
      </footer>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
}

