'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '@/lib/i18n';

const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({
  lang: 'en',
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('moi-lang') as Lang | null;
    if (stored) setLang(stored);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ta' : 'en';
      localStorage.setItem('moi-lang', next);
      return next;
    });
  };

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
