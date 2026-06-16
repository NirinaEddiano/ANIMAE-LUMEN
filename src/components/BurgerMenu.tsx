'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const LINKS = [
  { href: '/', labelFr: 'Accueil', labelEn: 'Home' },
  { href: '/decouvrir', labelFr: 'Découvrir', labelEn: 'Discover' },
  { href: '/about', labelFr: 'À Propos', labelEn: 'About' },
  { href: '/contact', labelFr: 'Contact', labelEn: 'Contact' },
];

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hamburger avec conteneur glassmorphisme */}
      <div className="fixed top-6 right-6 md:top-8 md:right-8 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center w-10 h-10 gap-[5px] rounded-full bg-neutral-900/10 backdrop-blur-md border border-white/20 hover:bg-neutral-900/20 transition-all duration-300 group"
          aria-label="Menu"
        >
          <span className="block w-5 h-px bg-white/80 group-hover:bg-white transition-colors duration-300" />
          <span className="block w-5 h-px bg-white/80 group-hover:bg-white transition-colors duration-300" />
        </button>
      </div>

      {/* Overlay plein écran */}
      {open && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center">
          {/* Fermeture */}
          <div className="fixed top-6 right-6 md:top-8 md:right-8 z-50">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900/10 backdrop-blur-md border border-white/20 hover:bg-neutral-900/20 transition-all duration-300 group"
              aria-label="Fermer"
            >
              <span className="block w-5 h-px bg-white/80 rotate-45 absolute group-hover:bg-white transition-colors duration-300" />
              <span className="block w-5 h-px bg-white/80 -rotate-45 absolute group-hover:bg-white transition-colors duration-300" />
            </button>
          </div>

          {/* Liens */}
          <nav className="flex flex-col items-center space-y-10">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl md:text-6xl font-light text-white/80 hover:text-white tracking-wide transition-all duration-300 hover:underline underline-offset-8 decoration-white/30"
              >
                {language === 'fr' ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
