'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from './DynamicText';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer 
      style={{
        backgroundColor: '#F5F2EB', // Même couleur sable que le reste du site
        borderTop: '1px solid #E5E2D9'
      }}
      className="relative z-10 w-full py-16 md:py-24 px-6 overflow-hidden"
    >
      {/* Texture de grain de papier naturelle et subtile pour le fond */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
          opacity: 0.35, // Grain doux et subtil
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
        {/* Titre et Bouton de Contact */}
        <div className="space-y-6">
          <DynamicText
            dbKey="footer_contact"
            as="p"
            className="font-serif text-3xl md:text-5xl font-extralight text-charcoal leading-tight tracking-wide"
            defaultText={language === 'fr' ? 'Rejoindre le cercle' : 'Join the circle'}
          />
          <Link
            href="/contact"
            className="inline-block text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-charcoal border border-charcoal/20 px-10 py-4 hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-500"
          >
            {language === 'fr' ? 'Prendre contact' : 'Get in touch'}
          </Link>
        </div>

        {/* Contacts épurés et structurés (Minuscules restaurées pour l'e-mail et l'Instagram) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-8 text-[10px] md:text-xs font-light text-charcoal/70 tracking-[0.18em]">
          <a
            href="mailto:animaelumen@outlook.com"
            className="hover:text-charcoal transition-colors duration-300 lowercase font-sans"
          >
            animaelumen@outlook.com
          </a>
          <span className="hidden md:inline text-charcoal/20">|</span>
          <a
            href="https://wa.me/33683843807"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-charcoal transition-colors duration-300 font-sans"
          >
            WhatsApp
          </a>
          <span className="hidden md:inline text-charcoal/20">|</span>
          <a
            href="https://www.instagram.com/animaelumen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-charcoal transition-colors duration-300 lowercase font-sans"
          >
            @animaelumen
          </a>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-charcoal/10">
          <p className="text-[10px] tracking-[0.2em] font-light text-charcoal/40">
            &copy; {new Date().getFullYear()} Animae Lumen
          </p>
        </div>
      </div>
    </footer>
  );
}
