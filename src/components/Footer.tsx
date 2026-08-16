'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from './DynamicText';
import InstagramSection from './InstagramSection';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer
      style={{
        backgroundColor: '#fcf7f3'
      }}
      className="relative z-10 w-full overflow-hidden"
    >

      <div className="flex flex-col md:flex-row">
        {/* Instagram (à gauche sur PC, en haut sur mobile) */}
        <div className="md:w-1/2">
          <InstagramSection backgroundColor="#fcf7f3" className="pb-10 md:pb-24" />
        </div>

        {/* Contenu du footer (à droite sur PC, en bas sur mobile) */}
        <div className="md:w-1/2 flex items-center justify-center px-6 pt-8 pb-16 md:py-24">
          <div className="w-full max-w-md text-center space-y-10">
            {/* Titre et Bouton de Contact */}
            <div className="space-y-6">
              <DynamicText
                dbKey="footer_contact"
                as="p"
                className="font-serif text-3xl md:text-5xl font-extralight text-charcoal leading-tight tracking-wide art-letterpress"
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
        </div>
      </div>
    </footer>
  );
}
