import { X, Download, Share2 } from 'lucide-react';
import { usePWA } from '../../context/PWAContext';
import { useLanguage } from '../../context/LanguageContext';

export function PWAInstallPrompt() {
  const { showInstallPrompt, isIOS, promptInstall, dismissInstall } = usePWA();
  const { t } = useLanguage();

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-kumbh-text">{t('common.installApp')}</h3>
          <button
            onClick={dismissInstall}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kumbh-orange to-kumbh-yellow flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-extrabold" style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>
              कुं
            </span>
          </div>
          <div>
            <p className="font-bold text-kumbh-text text-base">कुंभ Ride</p>
            <p className="text-sm text-gray-500">Your Journey. Your Kumbh.</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{t('common.installIOS')}</p>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Share2 size={20} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium">1. Tap Share <span className="text-blue-500">⎋</span></p>
                <p className="text-gray-500">In the Safari toolbar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                <span className="text-white text-lg">⊞</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">2. Add to Home Screen</p>
                <p className="text-gray-500">Scroll down and tap it</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{t('common.installAndroid')}</p>
            <button
              onClick={promptInstall}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Install App
            </button>
          </div>
        )}

        <button
          onClick={dismissInstall}
          className="w-full mt-3 text-center text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          {t('common.dismiss')}
        </button>
      </div>
    </div>
  );
}

