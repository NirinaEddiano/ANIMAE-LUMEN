'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 z-50 p-6 md:p-8">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-charcoal/20 backdrop-blur-xs">
        <button
          onClick={() => setLanguage('fr')}
          className={`font-serif text-sm md:text-base tracking-[0.25em] text-white transition-colors duration-300 ${
            language === 'fr'
              ? 'font-bold opacity-100'
              : 'font-light opacity-50 hover:opacity-70'
          }`}
        >
          Français
        </button>
        <span className="font-serif text-sm text-white/30">/</span>
        <button
          onClick={() => setLanguage('en')}
          className={`font-serif text-sm md:text-base tracking-[0.25em] text-white transition-colors duration-300 ${
            language === 'en'
              ? 'font-bold opacity-100'
              : 'font-light opacity-50 hover:opacity-70'
          }`}
        >
          English
        </button>
      </div>
    </header>
  );
}
