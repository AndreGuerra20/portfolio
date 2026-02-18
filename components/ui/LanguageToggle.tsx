"use client";

import { useLanguage } from "@/context/language-context";

const LanguageToggle = () => {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="rounded-md border border-white/30 px-2 py-1 text-xs text-white hover:border-purple hover:text-purple transition-colors"
      aria-label="Toggle language"
    >
      {locale === "en" ? "PT" : "EN"}
    </button>
  );
};

export default LanguageToggle;
