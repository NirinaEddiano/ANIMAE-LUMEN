'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from './DynamicText';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="relative z-10 w-full py-20 md:py-28 px-6 bg-clay/10 border-t border-clay/15">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/paper.svg")',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <DynamicText
            dbKey="footer_contact"
            as="p"
            className="font-serif text-3xl md:text-5xl font-light text-charcoal leading-tight tracking-wide"
            defaultText={language === 'fr' ? 'Rejoindre le cercle' : 'Join the circle'}
          />
          <Link
            href="/contact"
            className="inline-block text-xs uppercase tracking-[0.3em] font-light text-charcoal border border-charcoal/30 px-10 py-4 hover:bg-charcoal hover:text-white transition-all duration-500"
          >
            {language === 'fr' ? 'Rejoindre le cercle' : 'Join the circle'}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-charcoal/80 tracking-wide">
          <a
            href="mailto:animaelumen@outlook.com"
            className="hover:text-charcoal transition-colors"
          >
            animaelumen@outlook.com
          </a>
          <a
            href="https://wa.me/33683843807"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-charcoal transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/animaelumen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-charcoal transition-colors"
          >
            @animaelumen
          </a>
        </div>

        <div className="pt-8 border-t border-charcoal/10">
          <p className="text-[10px] tracking-[0.2em] font-light text-charcoal/40">
            &copy; {new Date().getFullYear()} Animae Lumen
          </p>
        </div>
      </div>
    </footer>
  );
}
