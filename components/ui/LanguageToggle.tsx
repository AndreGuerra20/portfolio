"use client";

import { Locale } from "@/data/i18n";
import { useLanguage } from "@/context/language-context";

const languages: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

const LanguageToggle = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed right-3 top-3 z-[6000] sm:right-5 sm:top-5">
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="min-w-[140px] rounded-md border border-white/30 bg-black-100 px-3 py-2 text-sm text-white focus:border-purple focus:outline-none"
        aria-label="Select language"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageToggle;
