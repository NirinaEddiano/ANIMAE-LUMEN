'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from './DynamicText';
import InstagramSection from './InstagramSection';
import { useSiteContent } from '@/lib/useSiteContent';
import { SITE_BYLINE_DEFAULT, SITE_BYLINE_KEY, SITE_EMAIL_DEFAULT, SITE_INSTAGRAM_DEFAULT, SITE_LOGO_DEFAULT } from '@/lib/navigation';

// Cles editees depuis l'admin pour le footer.
const FOOTER_KEYS = [
  'footer_cta_text',
  'footer_email',
  'footer_whatsapp_label',
  'insta_username',
];

export default function Footer({
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
} = {}) {
  const { language } = useLanguage();
  const rows = useSiteContent(FOOTER_KEYS);

  const value = (key: string, fr: string, en: string): string => {
    const row = rows.find((r) => r.key === key);
    const raw = language === 'fr' ? row?.value_fr : row?.value_en;
    return (raw || '').trim() || fr;
  };

  // L'email et le pseudo Instagram servent a la fois a l'affichage ET au lien :
  // ils viennent de la base, jamais d'une constante dans le code.
  const email = SITE_EMAIL_DEFAULT;
  const instaHandle = SITE_INSTAGRAM_DEFAULT;

  return (
    <footer
      style={{
        backgroundColor: '#fcf7f3'
      }}
      className="relative z-10 w-full overflow-hidden"
    >

      {/* Une seule colonne centree. Sur ordinateur le pied de page etait
          repartir en deux colonnes (Instagram a gauche, contenu a droite) :
          les deux blocs etaient decales et rien ne tombaient sur le meme axe.
          Ici tout s'empile sur un axe vertical unique. */}
      <div className="flex flex-col items-center text-center px-6">

        {/* Instagram au-dessus, puis le texte en dessous. */}
        <div className="w-full">
          <InstagramSection
            backgroundColor="#fcf7f3"
            className="!py-12 md:!py-14"
            compact
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            dbContent={dbContent}
          />
        </div>

        {/* Contenu du pied de page */}
        <div className="w-full max-w-md pb-14 md:pb-16">
          <div className="space-y-8">
            {/* Titre et Bouton de Contact */}
            <div className="space-y-5">
              <DynamicText
                dbKey="footer_contact"
                as="p"
                isEditing={isEditing}
                selectedKey={selectedKey}
                onSelectKey={onSelectKey}
                onUpdateText={onUpdateText}
                dbContent={dbContent}
                className="font-serif text-xl md:text-2xl font-extralight text-charcoal/90 leading-tight tracking-wide art-letterpress"
                defaultText={language === 'fr' ? 'Rejoindre le cercle' : 'Join the circle'}
              />
              <Link
                href="/contact"
                className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-light text-charcoal/70 border border-charcoal/20 px-7 py-3 hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-500"
              >
                {value('footer_cta_text', 'Prendre contact', 'Get in touch')}
              </Link>
            </div>

            {/* Contacts épurés et structurés (Minuscules restaurées pour l'e-mail et l'Instagram) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-y-3 md:gap-x-7 text-[10px] md:text-[11px] font-light text-charcoal/55 tracking-[0.14em]">
              <a
                href={`mailto:${email}`}
                className="hover:text-charcoal transition-colors duration-300 lowercase font-sans"
              >
                {email}
              </a>
              <span className="hidden md:inline text-charcoal/20">|</span>
              <a
                href="https://wa.me/33683843807"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-charcoal transition-colors duration-300 font-sans"
              >
                {value('footer_whatsapp_label', 'WhatsApp', 'WhatsApp')}
              </a>
              <span className="hidden md:inline text-charcoal/20">|</span>
              <a
                href={`https://www.instagram.com/${instaHandle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-charcoal transition-colors duration-300 lowercase font-sans"
              >
                {instaHandle}
              </a>
            </div>

            {/* Copyright — nom du site et signature sur la meme ligne, la signature
                a droite du nom. Les deux sont dynamiques. */}
            <div className="pt-6 border-t border-charcoal/10">
              <p className="flex flex-wrap items-baseline justify-center gap-x-2 text-charcoal/45">
                <span className="text-[10px] tracking-[0.18em] font-light">
                  &copy; {new Date().getFullYear()}
                </span>
                <span className="text-[10px] tracking-[0.18em] font-light">{SITE_LOGO_DEFAULT}</span>
                <DynamicText
                  dbKey={SITE_BYLINE_KEY}
                  as="span"
                  isEditing={isEditing}
                  selectedKey={selectedKey}
                  onSelectKey={onSelectKey}
                  onUpdateText={onUpdateText}
                  dbContent={dbContent}
                  defaultText={SITE_BYLINE_DEFAULT}
                  className="site-byline text-[9px] text-charcoal/35"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
