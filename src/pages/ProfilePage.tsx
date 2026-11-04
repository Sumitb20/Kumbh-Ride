import React, { useState, useEffect } from 'react';
import { useLanguage, languageNames } from '../context/LanguageContext';
import { usePWA } from '../context/PWAContext';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import {
  User,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  ChevronDown,
  Ticket,
  Download,
  HelpCircle,
  Info,
  LogOut,
  Edit2,
  Save,
  Check,
  X,
  CreditCard,
} from 'lucide-react';
import { getRazorpayKey, setRazorpayKey } from '../services/razorpay';
import { getReceiverUpiId, setReceiverUpiId } from '../services/upi';

interface Profile {
  name: string;
  phone: string;
  email: string;
}

const STORAGE_KEY = 'kumbh_profile';

const defaultProfile: Profile = {
  name: 'Yatri',
  phone: '+91 98765 43210',
  email: '',
};

const ProfilePage: React.FC = () => {
  const { lang, t, setLang } = useLanguage();
  const { isOffline, isInstallable, promptInstall } = usePWA();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile>(defaultProfile);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [rzpKey, setRzpKey] = useState<string>(getRazorpayKey());
  const [keySaved, setKeySaved] = useState(false);
  const [upiReceiver, setUpiReceiver] = useState<string>(getReceiverUpiId());
  const [upiSaved, setUpiSaved] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Profile;
        setProfile(parsed);
        setEditProfile(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleSave = () => {
    setProfile(editProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editProfile));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const languageOptions: { key: Language; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'hi', label: 'हिन्दी' },
    { key: 'mr', label: 'मराठी' },
  ];

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'Y';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
      {/* Profile Header */}
      <div className="card flex flex-col items-center text-center mb-6 relative">
        {/* Edit toggle */}
        {!isEditing && (
          <button
            onClick={() => {
              setEditProfile(profile);
              setIsEditing(true);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Edit profile"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
        )}

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-kumbh-orange to-kumbh-deep flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl font-bold text-white">{initial}</span>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="w-full space-y-3 mt-2">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                className="input-field pl-10 w-full"
                placeholder={t('profile.name')}
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={editProfile.phone}
                onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                className="input-field pl-10 w-full"
                placeholder={t('profile.phone')}
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={editProfile.email}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                className="input-field pl-10 w-full"
                placeholder={t('profile.email')}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {t('profile.save')}
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <X size={16} />
                {t('profile.cancelEdit')}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
            <h2 className="text-xl font-bold text-kumbh-text">
              {profile.name}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <Phone size={14} />
              {profile.phone}
            </div>
            {profile.email && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                <Mail size={14} />
                {profile.email}
              </div>
            )}
          </>
        )}
      </div>

      {/* Settings Section */}
      <div className="card mb-6 p-0 overflow-hidden">
        <h3 className="section-title px-5 pt-5 pb-2">{t('profile.settings')}</h3>

        {/* Language */}
        <div>
          <button
            onClick={() => toggleSection('language')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Globe size={18} className="text-blue-600" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-kumbh-text">
                  {t('profile.language')}
                </span>
                <span className="block text-xs text-gray-400">
                  {languageNames[lang]}
                </span>
              </div>
            </div>
            {expandedSection === 'language' ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'language' && (
            <div className="px-5 pb-4 animate-fade-in">
              <div className="bg-gray-50 rounded-xl p-1 flex gap-1">
                {languageOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setLang(option.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                      lang === option.key
                        ? 'bg-white text-kumbh-orange shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {lang === option.key && <Check size={14} />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* My Bookings */}
        <button
          onClick={() => navigate('/bookings')}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Ticket size={18} className="text-kumbh-orange" />
            </div>
            <span className="text-sm font-medium text-kumbh-text">
              {t('profile.myBookings')}
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* Install App — conditional */}
        {isInstallable && (
          <>
            <div className="h-px bg-gray-100 mx-5" />
            <button
              onClick={promptInstall}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Download size={18} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-kumbh-text">
                  {t('profile.installApp')}
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </>
        )}

        <div className="h-px bg-gray-100 mx-5" />

        {/* Live UPI Payment ID */}
        <div>
          <button
            onClick={() => toggleSection('upi')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                <span className="font-extrabold text-kumbh-deep text-xs">UPI</span>
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-kumbh-text block">
                  Live UPI Receiver ID
                </span>
                <span className="text-[11px] text-kumbh-orange font-mono">
                  {upiReceiver}
                </span>
              </div>
            </div>
            {expandedSection === 'upi' ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'upi' && (
            <div className="px-5 pb-4 space-y-3 animate-fade-in">
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 space-y-2 text-xs">
                <p className="font-semibold text-kumbh-deep">
                  Receiver Google Pay / PhonePe UPI ID
                </p>
                <p className="text-gray-600 leading-relaxed">
                  All customer ride and hotel payments will be credited directly to this UPI address via QR code and 1-tap UPI app intents.
                </p>
                <input
                  type="text"
                  value={upiReceiver}
                  onChange={(e) => {
                    setUpiReceiver(e.target.value);
                    setUpiSaved(false);
                  }}
                  placeholder="yourname@okbank"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-orange-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-kumbh-orange"
                />
                <button
                  type="button"
                  onClick={() => {
                    setReceiverUpiId(upiReceiver);
                    setUpiSaved(true);
                    setTimeout(() => setUpiSaved(false), 2500);
                  }}
                  className="btn-primary w-full py-2 text-xs"
                >
                  {upiSaved ? 'Saved Successfully! ✓' : 'Save UPI ID'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* Razorpay Developer Mode */}
        <div>
          <button
            onClick={() => toggleSection('razorpay')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <CreditCard size={18} className="text-blue-600" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-kumbh-text block">
                  Razorpay Developer Gateway
                </span>
                <span className="text-[11px] text-blue-600 font-mono">
                  {rzpKey.slice(0, 14)}...
                </span>
              </div>
            </div>
            {expandedSection === 'razorpay' ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'razorpay' && (
            <div className="px-5 pb-4 space-y-3 animate-fade-in">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs">
                <p className="font-semibold text-blue-950">
                  Razorpay Test Key (rzp_test_...)
                </p>
                <p className="text-blue-800 leading-relaxed">
                  Enter your Razorpay Test Key ID to connect your real Razorpay sandbox. Leave empty to use the default test sandbox.
                </p>
                <input
                  type="text"
                  value={rzpKey}
                  onChange={(e) => {
                    setRzpKey(e.target.value);
                    setKeySaved(false);
                  }}
                  placeholder="rzp_test_..."
                  className="w-full px-3 py-2 bg-white rounded-lg border border-blue-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRazorpayKey(rzpKey);
                    setKeySaved(true);
                    setTimeout(() => setKeySaved(false), 2500);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors"
                >
                  {keySaved ? 'Saved Successfully! ✓' : 'Save Razorpay Key'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* Help & Support */}
        <div>
          <button
            onClick={() => toggleSection('help')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <HelpCircle size={18} className="text-amber-600" />
              </div>
              <span className="text-sm font-medium text-kumbh-text">
                {t('profile.help')}
              </span>
            </div>
            {expandedSection === 'help' ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'help' && (
            <div className="px-5 pb-4 animate-fade-in">
              <div className="bg-amber-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {t('profile.helpText')}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* About */}
        <div>
          <button
            onClick={() => toggleSection('about')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <Info size={18} className="text-purple-600" />
              </div>
              <span className="text-sm font-medium text-kumbh-text">
                {t('profile.about')}
              </span>
            </div>
            {expandedSection === 'about' ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'about' && (
            <div className="px-5 pb-4 animate-fade-in">
              <div className="bg-purple-50 rounded-xl p-5 text-center">
                {/* App Logo */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kumbh-orange to-kumbh-deep flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-2xl font-bold text-white">कु</span>
                </div>
                <h4 className="text-base font-bold text-kumbh-text mb-1">कुंभ Ride</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {t('profile.aboutText')}
                </p>

                <div className="my-3 p-3 bg-white rounded-2xl border border-purple-100 shadow-xs flex flex-col items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    Official Event & Mobility Partner
                  </span>
                  <img src="./buildtek-logo.png" alt="BuildTek Events" className="h-6 object-contain" />
                  <p className="text-[11px] text-gray-500">
                    Smart Event Infrastructure & Pilgrim Mobility
                  </p>
                </div>

                <span className="inline-block text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                  {t('profile.version')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors min-h-[52px]"
      >
        <LogOut size={18} />
        {t('profile.signOut')}
      </button>

      {/* Offline badge */}
      {isOffline && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            {t('profile.offline')}
          </span>
        </div>
      )}
    </div>
  );
};

export { ProfilePage };
export default ProfilePage;
