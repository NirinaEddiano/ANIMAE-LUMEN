'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { fontFamilyWithFallback, isHiddenKey, readContent, readImage } from '@/lib/content';
import { SITE_BYLINE_DEFAULT, SITE_BYLINE_KEY } from '@/lib/navigation';

interface ContentItem {
  key: string;
  value_fr: string;
  value_en: string;
  font_family: string;
  font_size: string;
  is_bold: boolean;
  is_stamped: boolean;
  is_image: boolean;
}

interface HeroProps {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: ContentItem[];
}

const REQUIRED_KEYS = [
  'home_hero_title',
  'home_hero_subtitle',
  'home_hero_intro',
  'home_hero_image',
  'btn_discover',
  SITE_BYLINE_KEY,
] as const;

const DEFAULT_HERO: Record<string, { fr: string; en: string }> = {
  home_hero_title: { fr: 'ANIMAE LUMEN', en: 'ANIMAE LUMEN' },
  home_hero_subtitle: { fr: "L'éclat de l'âme", en: 'The radiance of the soul' },
  home_hero_intro: {
    fr: 'Une démarche spirituelle, introspective, suspendue hors du temps.',
    en: 'A spiritual, introspective approach, suspended outside of time.',
  },
  btn_discover: { fr: 'ENTRER DANS LE CERCLE', en: 'ENTER THE CIRCLE' },
  // La signature est identique dans les deux langues, c'est voulu.
  [SITE_BYLINE_KEY]: { fr: SITE_BYLINE_DEFAULT, en: SITE_BYLINE_DEFAULT },
  home_hero_image: {
    fr: 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg',
    en: 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg',
  },
};

export default function Hero({
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: HeroProps) {
  const { language } = useLanguage();
  const [fetched, setFetched] = useState<ContentItem[]>([]);

  // Fetch réel Supabase
  useEffect(() => {
    if (isEditing) return;
    supabase
      .from('site_content')
      .select('*')
      .in('key', REQUIRED_KEYS)
      .then(({ data }) => {
        if (data) setFetched(data);
      });
  }, [isEditing]);

  // Résolution : en admin → dbContent, sinon → fetched
  const items = isEditing ? dbContent : fetched;

  // Jamais de repli sur l'autre langue : une valeur vide retombe sur le défaut en anglais.
  const get = (key: string): string => readContent(items, key, language, DEFAULT_HERO[key]?.[language] ?? '');

  const getImage = (key: string): string =>
    readImage(items, key, DEFAULT_HERO[key]?.en || DEFAULT_HERO[key]?.fr || '');

  const getStyle = (key: string): React.CSSProperties => {
    const item = items.find((i) => i.key === key);
    if (!item) return {};
    return {
      fontFamily: fontFamilyWithFallback(item.font_family),
      fontSize: item.font_size
        ? `clamp(min(24px, ${item.font_size}), 8vw, ${item.font_size})`
        : undefined,
      fontWeight: item.is_bold ? 'bold' : undefined,
    };
  };

  const getStampClass = (key: string): string => {
    const item = items.find((i) => i.key === key);
    return item?.is_stamped ? 'effect-letterpress' : '';
  };

  const handleBlur = (key: string, e: React.FocusEvent<HTMLElement>) => {
    const val = e.currentTarget.innerText || '';
    if (isEditing && onUpdateText) {
      onUpdateText(key, val);
    }
    if (isEditing && !onUpdateText) {
      // Sauvegarde directe Supabase (mode autonome)
      const field = language === 'fr' ? 'value_fr' : 'value_en';
      supabase.from('site_content').update({ [field]: val }).eq('key', key).then();
    }
  };

  const handleClick = (key: string) => {
    if (isEditing && onSelectKey) onSelectKey(key);
  };

  const handleImgClick = (key: string) => {
    if (!isEditing) return;
    if (onSelectKey) onSelectKey(key);
    // Cible l'input d'upload de contenu de l'admin par son attribut dedie.
    // Un selecteur global 'input[type="file"]' pouvait viser l'input du
    // portfolio ou celui d'une autre section, et l'upload n'allait nulle part.
    document.querySelector<HTMLInputElement>('input[data-site-upload="content"]')?.click();
  };

  // Pas d'écran de chargement ni d'écran d'erreur bloquant : les replis codés en
  // dur affichent un hero correct en anglais, la base vient seulement enrichir.
  const heroImage = getImage('home_hero_image');
  const isImgSelected = isEditing && selectedKey === 'home_hero_image';



  const hidden = (...keys: string[]) => keys.every((k) => isHiddenKey(items, k));

  if (hidden(...REQUIRED_KEYS)) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Hero — background-image CSS */}
      <div
        onClick={() => handleImgClick('home_hero_image')}
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 ${
          isEditing ? 'cursor-pointer hover:brightness-75' : ''
        } ${isImgSelected ? 'ring-4 ring-sage/40 ring-inset' : ''}`}
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Overlay noir léger */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/70 pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'url("/grain.svg")',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          mixBlendMode: 'multiply',
          opacity: 0.4,
        }}
      />

      {/* Contenu central */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="max-w-3xl space-y-4 md:space-y-8 pointer-events-none">
          {/* 1. TITRE PRINCIPAL + SIGNATURE — le nom et « by TINA ROSAE » sur la
              MÊME ligne, la signature alignee sur la ligne de base du nom et
              posee a sa droite. Plus petite que le nom, mais assez grande pour
              etre lue. Contenu dynamique (cles home_hero_title / site_byline). */}
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 md:gap-x-5 gap-y-1">
            <h1
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('home_hero_title', e)}
              onClick={() => handleClick('home_hero_title')}
              style={{ ...getStyle('home_hero_title'), fontWeight: 100 }}
              className={`pointer-events-auto text-white font-serif text-3xl md:text-6xl lg:text-7xl tracking-[0.12em] leading-tight outline-none transition-all duration-200 ${getStampClass('home_hero_title')} ${
                isEditing ? 'cursor-text' : ''
              } ${isEditing && selectedKey === 'home_hero_title' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
            >
              {get('home_hero_title')}
            </h1>

            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(SITE_BYLINE_KEY, e)}
              onClick={() => handleClick(SITE_BYLINE_KEY)}
              style={getStyle(SITE_BYLINE_KEY)}
              className={`site-byline pointer-events-auto text-white/75 text-[11px] md:text-sm lg:text-base whitespace-nowrap outline-none transition-all duration-200 ${
                isEditing ? 'cursor-text' : ''
              } ${isEditing && selectedKey === SITE_BYLINE_KEY ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
            >
              {get(SITE_BYLINE_KEY)}
            </p>
          </div>

          {/* 2. PREMIER SOUS-TITRE (Agrandis la taille, rends-le plus blanc en text-white/80, et en italique) */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('home_hero_subtitle', e)}
            onClick={() => handleClick('home_hero_subtitle')}
            style={{ ...getStyle('home_hero_subtitle'), fontWeight: 200 }}
            className={`pointer-events-auto text-white/80 font-serif italic font-light text-lg md:text-xl lg:text-2xl tracking-wide mt-4 md:mt-6 outline-none transition-all duration-200 ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === 'home_hero_subtitle' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {get('home_hero_subtitle')}
          </p>

          {/* 3. DEUXIÈME SOUS-TITRE (Reste STRICTEMENT identique à son style d'origine sans modification) */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('home_hero_intro', e)}
            onClick={() => handleClick('home_hero_intro')}
            style={getStyle('home_hero_intro')}
            className={`pointer-events-auto text-white/60 font-sans text-xs md:text-sm lg:text-base font-light leading-relaxed tracking-wide max-w-lg mx-auto mt-6 md:mt-8 outline-none transition-all duration-200 ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === 'home_hero_intro' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {get('home_hero_intro')}
          </p>

          {/* CTA */}
          <div className="pt-4">
            <Link
              href="/decouvrir"
              onClick={(e) => isEditing && e.preventDefault()}
              className="group pointer-events-auto inline-block text-[10px] md:text-xs lg:text-sm uppercase tracking-[0.35em] border border-white/25 px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 hover:bg-white hover:border-white transition-all duration-500"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur('btn_discover', e)}
                onClick={() => handleClick('btn_discover')}
                style={getStyle('btn_discover')}
                className={`text-white/70 group-hover:text-charcoal outline-none transition-all duration-200 ${
                  isEditing ? 'cursor-text' : ''
                } ${isEditing && selectedKey === 'btn_discover' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
              >
                {get('btn_discover')}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
