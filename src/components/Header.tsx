'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

// Dictionnaire de traduction statique temporaire pour le Header
const menuTranslations = {
  fr: {
    home: 'Accueil',
    about: 'À Propos',
    portfolio: 'Portfolio',
    contact: 'Contacter',
  },
  en: {
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    contact: 'Contact',
  },
};

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = menuTranslations[language];

  // Détecter le scroll pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Liens du menu
  const navLinks = [
    { href: '/', label: t.home },
    { href: '/about', label: t.about },
    { href: '/portfolio', label: t.portfolio },
  ];

  return (
    <header
  className={`fixed top-0 left-0 w-full z-50 ${
    isScrolled
      ? 'bg-white/90 backdrop-blur-md border-b border-neutral-100/50 shadow-sm py-4 text-neutral-800'
      : 'bg-black/15 backdrop-blur-xs py-6 text-white'
  }`}
>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* À GAUCHE : Logo artistique */}
        <Link href="/" className="font-serif text-xl lg:text-2xl tracking-[0.25em] font-light transition-opacity hover:opacity-80">
          ANIMAE LUMEN
        </Link>

        {/* AU MILIEU : Menu principal (Masqué sur mobile) */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-[0.15em] uppercase font-light transition-all duration-300 relative py-1 hover:opacity-100 ${
                  isActive ? 'opacity-100 font-normal' : 'opacity-70'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1px] transition-colors duration-500 ${
                      isScrolled ? 'bg-neutral-800' : 'bg-white'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* À DROITE : Traduction & Bouton Contact (Masqué sur mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Sélecteur de langue */}
          <div className="flex items-center space-x-2 text-xs tracking-widest font-light">
            <button
              onClick={() => setLanguage('fr')}
              className={`transition-all ${
                language === 'fr' ? 'font-medium opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-80'
              }`}
            >
              FR
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`transition-all ${
                language === 'en' ? 'font-medium opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-80'
              }`}
            >
              EN
            </button>
          </div>
          
          
          {/* Bouton Contacter */}
          <Link
            href="/contact"
            className={`text-xs uppercase tracking-[0.2em] font-light px-6 py-2.5 border transition-all duration-300 rounded-none ${
              isScrolled
                ? 'border-neutral-800/30 text-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-800'
                : 'border-white/30 text-white hover:bg-white hover:text-neutral-900 hover:border-white'
            }`}
          >
            {t.contact}
          </Link>

          {/* Icône Instagram */}
<a
  href="https://www.instagram.com/animaelumen"
  target="_blank"
  rel="noopener noreferrer"
  className="opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
  aria-label="Instagram"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
</a>

        </div>

        {/* BOUTON MENU MOBILE (Hamburger) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-6 h-[1px] transition-transform duration-300 ${
              isScrolled ? 'bg-neutral-800' : 'bg-white'
            } ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
          />
          <span
            className={`w-6 h-[1px] transition-opacity duration-300 ${
              isScrolled ? 'bg-neutral-800' : 'bg-white'
            } ${isMobileMenuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`w-6 h-[1px] transition-transform duration-300 ${
              isScrolled ? 'bg-neutral-800' : 'bg-white'
            } ${isMobileMenuOpen ? '-rotate-45 translate-y-[-7px]' : ''}`}
          />
        </button>
      </div>

      {/* TIROIR DE NAVIGATION MOBILE */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 h-screen bg-white text-neutral-800 shadow-2xl transition-transform duration-500 ease-in-out z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-28 px-8 space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg tracking-[0.2em] uppercase font-light border-b border-neutral-100 pb-3"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg tracking-[0.2em] uppercase font-light border-b border-neutral-100 pb-3"
          >
            {t.contact}
          </Link>

          {/* Langues Mobile */}
          <div className="flex items-center space-x-4 pt-4 text-sm tracking-widest">
            <button
              onClick={() => {
                setLanguage('fr');
                setIsMobileMenuOpen(false);
              }}
              className={`transition-all ${language === 'fr' ? 'font-bold underline underline-offset-4' : 'opacity-50'}`}
            >
              FRANÇAIS
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => {
                setLanguage('en');
                setIsMobileMenuOpen(false);
              }}
              className={`transition-all ${language === 'en' ? 'font-bold underline underline-offset-4' : 'opacity-50'}`}
            >
              ENGLISH
            </button>
          </div>
        </div>
      </div>

      {/* Arrière-plan flou cliquable pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-30"
        />
      )}
    </header>
  );
}