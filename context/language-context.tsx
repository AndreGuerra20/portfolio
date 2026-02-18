"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, portfolioTranslations } from "@/data/i18n";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (typeof portfolioTranslations)[Locale];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY);
    if (savedLocale === "pt" || savedLocale === "en") {
      setLocaleState(savedLocale);
      return;
    }

    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith("pt")) {
      setLocaleState("pt");
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem(STORAGE_KEY, nextLocale);
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "pt" : "en");
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: portfolioTranslations[locale],
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
