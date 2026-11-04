import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationDict } from '../types';
import en from '../translations/en';
import hi from '../translations/hi';
import mr from '../translations/mr';

const dictionaries: Record<Language, TranslationDict> = { en, hi, mr };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('kumbh_lang');
    return (saved as Language) || 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('kumbh_lang', newLang);
    document.documentElement.lang = newLang === 'en' ? 'en' : newLang === 'hi' ? 'hi' : 'mr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : 'mr';
  }, [lang]);

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    let value = dictionaries[lang][key] || dictionaries['en'][key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }
    return value;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

