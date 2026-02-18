"use client";

import { Locale } from "@/data/i18n";
import { useLanguage } from "@/context/language-context";
import { useEffect, useMemo, useRef, useState } from "react";

type LanguageToggleProps = {
  mobile?: boolean;
};

const languages: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

const LanguageToggle = ({ mobile = false }: LanguageToggleProps) => {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = useMemo(
    () => languages.find((language) => language.value === locale) ?? languages[0],
    [locale],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (mobile) {
    return (
      <div className="flex items-center gap-1 sm:hidden">
        {languages.map((language) => (
          <button
            key={language.value}
            type="button"
            onClick={() => setLocale(language.value)}
            aria-label={`Switch language to ${language.label}`}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              locale === language.value
                ? "border-purple text-purple bg-white/10"
                : "border-white/30 text-white hover:border-purple hover:text-purple"
            }`}
          >
            <span className="mr-1">{language.flag}</span>
            <span>{language.value.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed right-3 top-3 z-[6000] hidden sm:block sm:right-5 sm:top-5">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="min-w-[170px] rounded-md border border-white/30 bg-black-100 px-3 py-2 text-left text-sm text-white focus:border-purple focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className="mr-2">{currentLanguage.flag}</span>
        {currentLanguage.label}
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-white/20 bg-black-100 p-1 shadow-lg">
          <ul role="listbox" className="text-sm text-white">
            {languages.map((language) => (
              <li key={language.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === language.value}
                  onClick={() => {
                    setLocale(language.value);
                    setOpen(false);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                    locale === language.value ? "bg-white/15 text-purple" : "hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">{language.flag}</span>
                  {language.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
