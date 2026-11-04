import { useNavigate } from 'react-router-dom';
import { Globe, User } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage, languageNames } from '../../context/LanguageContext';
import { Language } from '../../types';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-orange-100">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <button onClick={() => navigate('/')} className="flex items-center gap-1">
          <Logo size="sm" />
        </button>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-sm font-medium text-kumbh-deep hover:bg-orange-100 transition-colors"
            >
              <Globe size={16} />
              <span>{languageNames[lang]}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden animate-fade-in z-50">
                {(Object.keys(languageNames) as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                      ${lang === l ? 'bg-orange-50 text-kumbh-orange' : 'text-kumbh-text hover:bg-gray-50'}`}
                  >
                    {languageNames[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-kumbh-deep hover:bg-orange-100 transition-colors"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

