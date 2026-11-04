import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Car, Building2, Ticket, UserCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.home' },
  { path: '/rides', icon: Car, labelKey: 'nav.rides' },
  { path: '/hotels', icon: Building2, labelKey: 'nav.hotels' },
  { path: '/bookings', icon: Ticket, labelKey: 'nav.bookings' },
  { path: '/profile', icon: UserCircle, labelKey: 'nav.profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 pb-safe md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, labelKey }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors
                ${active ? 'text-kumbh-orange' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

