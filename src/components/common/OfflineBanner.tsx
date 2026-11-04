import { WifiOff } from 'lucide-react';
import { usePWA } from '../../context/PWAContext';
import { useLanguage } from '../../context/LanguageContext';

export function OfflineBanner() {
  const { isOffline } = usePWA();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-slide-up">
      <WifiOff size={16} />
      <span>{t('common.offline')} — {t('common.offlineDesc')}</span>
    </div>
  );
}

