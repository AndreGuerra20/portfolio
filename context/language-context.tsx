"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, portfolioTranslations } from "@/data/i18n";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof portfolioTranslations[keyof typeof portfolioTranslations];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_locale";
const SUPPORTED_LOCALES: Locale[] = ["en", "pt", "de", "fr"];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY);
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale as Locale);
      return;
    }

    const browserLanguage = navigator.language.toLowerCase();
    const browserLocale = SUPPORTED_LOCALES.find((value) => browserLanguage.startsWith(value));

    if (browserLocale) {
      setLocaleState(browserLocale);
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem(STORAGE_KEY, nextLocale);
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: portfolioTranslations[locale as keyof typeof portfolioTranslations] ?? portfolioTranslations.en,
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
