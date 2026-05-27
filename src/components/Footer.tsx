'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

// Dictionnaire de traduction du Footer
const footerTranslations = {
  fr: {
    tagline: 'Capturer l\'invisible, honorer l\'instant présent.',
    menuTitle: 'Navigation',
    contactTitle: 'Prendre contact',
    home: 'Accueil',
    about: 'À Propos',
    portfolio: 'Portfolio',
    contact: 'Contact',
    rights: 'Tous droits réservés.',
  },
  en: {
    tagline: 'Capturing the unseen, honoring the present moment.',
    menuTitle: 'Navigation',
    contactTitle: 'Get in touch',
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    contact: 'Contact',
    rights: 'All rights reserved.',
  }
};

export default function Footer() {
  const { language } = useLanguage();
  const t = footerTranslations[language];

  return (
    <footer className="bg-[#E2DDD5] border-t border-neutral-300/40 pt-20 pb-12 px-6 lg:px-12 text-neutral-950">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* GRILLE DU PIED DE PAGE (3 Colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 items-start">
          
          {/* COLONNE GAUCHE : Identité et Logo Fortement Agrandi */}
          <div className="space-y-4">
            <Link href="/" className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] font-light block text-neutral-950">
              ANIMAE LUMEN
            </Link>
            <p className="font-sans text-xs md:text-sm tracking-wide font-light text-neutral-800 max-w-xs leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* COLONNE CENTRALE : Menu de Navigation */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase font-semibold text-neutral-950">
              {t.menuTitle}
            </h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="font-sans text-xs tracking-widest uppercase font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300">
                {t.home}
              </Link>
              <Link href="/about" className="font-sans text-xs tracking-widest uppercase font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300">
                {t.about}
              </Link>
              <Link href="/portfolio" className="font-sans text-xs tracking-widest uppercase font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300">
                {t.portfolio}
              </Link>
              <Link href="/contact" className="font-sans text-xs tracking-widest uppercase font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300">
                {t.contact}
              </Link>
            </nav>
          </div>

          {/* COLONNE DROITE : Contacts uniques avec Icônes SVG fines */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase font-semibold text-neutral-950">
              {t.contactTitle}
            </h4>
            <div className="flex flex-col space-y-4">
              
              {/* E-mail avec SVG */}
              <a 
                href="mailto:animaelumen@outlook.com" 
                className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="shrink-0"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>animaelumen@outlook.com</span>
              </a>

              {/* WhatsApp avec SVG */}
              <a 
                href="https://wa.me/33683843807" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="shrink-0"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>WhatsApp: +33 6 83 84 38 07</span>
              </a>

              {/* Instagram avec SVG */}
              <a 
                href="https://www.instagram.com/animaelumen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="shrink-0"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram: @animaelumen</span>
              </a>
            </div>
          </div>

        </div>

        {/* LIGNE DU BAS : Copyright discret et contrasté */}
        <div className="pt-8 border-t border-neutral-300/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs tracking-widest font-light text-neutral-800">
          <p>© {new Date().getFullYear()} ANIMAE LUMEN. {t.rights}</p>
          <p className="italic font-normal">Lumière consciente — Presence & Art</p>
        </div>

      </div>
    </footer>
  );
}