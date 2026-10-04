'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { isHiddenKey, readContent, readImage } from '@/lib/content';


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

const REQUIRED_KEYS = [
  'discover_hero_image',
  'discover_hero_title',
  'discover_hero_subtitle',
  'discover_services_title',
  'portfolio_grid_bg_texture',
  'cat_1_title', 'cat_1_subtitle', 'cat_1_img',
  'cat_2_title', 'cat_2_subtitle', 'cat_2_img',
  'cat_3_title', 'cat_3_subtitle', 'cat_3_img',
];

const CATEGORIES = [
  { dbKey: 'cat_1', slug: 'souls' },
  { dbKey: 'cat_2', slug: 'events' },
  { dbKey: 'cat_3', slug: 'retreats' },
] as const;

const DISCOVER_DEFAULTS: Record<string, { fr: string; en: string }> = {
  discover_hero_title: { fr: 'Choisir une voie', en: 'Choose a path' },
  discover_hero_subtitle: { fr: "L'univers d'ANIMAE LUMEN", en: 'The world of ANIMAE LUMEN' },
  discover_services_title: { fr: 'MES GALERIES', en: 'MY GALLERIES' },
  cat_1_title: { fr: 'ÂMES', en: 'SOULS' },
  cat_1_subtitle: {
    fr: 'Portraits et travail autour de l’humain',
    en: 'Portraits and work around the human',
  },
  cat_2_title: { fr: 'ÉVÉNEMENTS', en: 'EVENTS' },
  cat_2_subtitle: {
    fr: 'Festivals, musique et événements, Travel',
    en: 'Festivals, music and events, Travel',
  },
  cat_3_title: { fr: 'RETRAITES', en: 'RETREATS' },
  cat_3_subtitle: {
    fr: 'Retraites et cérémonies',
    en: 'Retreats and ceremonies',
  },
};

export default function DiscoverPage({
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
}) {
  const { language } = useLanguage();
  const [fetched, setFetched] = useState<ContentItem[]>([]);

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

  const items = isEditing ? dbContent : fetched;

  // Masquage choisis par l'administrateur : un bloc disparait du site
  // public quand TOUS ses contenus sont masques. La condition 'every'
  // evite de laisser un trou de mise en page si un seul element reste.
  const hidden = (...keys: string[]) => keys.every((k) => isHiddenKey(items, k));

  const get = (key: string): string =>
    readContent(items, key, language, DISCOVER_DEFAULTS[key]?.[language] ?? '');

  const getImage = (key: string): string => readImage(items, key, '');

  const getStampClass = (key: string): string => {
    const item = items.find((i) => i.key === key);
    return item?.is_stamped ? 'effect-letterpress' : '';
  };

  const saveToSupabase = (key: string, val: string) => {
    const field = language === 'fr' ? 'value_fr' : 'value_en';
    supabase.from('site_content').update({ [field]: val }).eq('key', key).then();
  };

  const handleBlur = (key: string, e: React.FocusEvent<HTMLElement>) => {
    const val = e.currentTarget.innerText || '';
    if (isEditing && onUpdateText) {
      onUpdateText(key, val);
    } else if (isEditing) {
      saveToSupabase(key, val);
    }
  };

  const handleImgClick = (key: string) => {
    if (isEditing && onSelectKey) {
      onSelectKey(key);
      document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
    }
  };

  const heroImg = getImage('discover_hero_image');
  const heroTitle = get('discover_hero_title');
  const heroSub = get('discover_hero_subtitle');
  const servicesTitle = get('discover_services_title');

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fcf7f3]">
      {/* === ZONE 1 : Hero (50vh) === */}
      <section className={`relative h-[50vh] w-full flex items-center justify-center overflow-hidden ${hidden('discover_hero_image', 'discover_hero_title', 'discover_hero_subtitle') ? 'hidden' : ''}`}>
        {heroImg && (
          <div
            onClick={() => handleImgClick('discover_hero_image')}
            className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 ${
              isEditing ? 'cursor-pointer hover:brightness-75' : ''
            } ${isEditing && selectedKey === 'discover_hero_image' ? 'ring-4 ring-sage/40 ring-inset' : ''}`}
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/70" />
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

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('discover_hero_title', e)}
            onClick={() => isEditing && onSelectKey?.('discover_hero_title')}
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-tight outline-none transition-all duration-200 ${getStampClass('discover_hero_title')} ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === 'discover_hero_title' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {heroTitle}
          </h1>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('discover_hero_subtitle', e)}
            onClick={() => isEditing && onSelectKey?.('discover_hero_subtitle')}
            className={`font-sans text-sm md:text-base tracking-[0.2em] font-light text-white/60 mt-4 outline-none transition-all duration-200 ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === 'discover_hero_subtitle' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {heroSub}
          </p>
        </div>
      </section>

      {/* === ZONE 2 : Bande titre services (10vh) === */}
      <section 
        style={{
          backgroundColor: '#fcf7f3'
        }}
        className={`relative h-[10vh] w-full flex items-center justify-center ${hidden('discover_services_title') ? 'hidden' : ''}`}
      >
        <h2
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleBlur('discover_services_title', e)}
          onClick={() => isEditing && onSelectKey?.('discover_services_title')}
          className={`relative z-10 font-sans text-sm md:text-base tracking-[0.35em] uppercase text-charcoal/80 font-light outline-none transition-all duration-200 ${
            isEditing ? 'cursor-text' : ''
          } ${isEditing && selectedKey === 'discover_services_title' ? 'ring-2 ring-sage/40 bg-charcoal/5' : ''}`}
        >
          {servicesTitle}
        </h2>
      </section>

      {/* === ZONE 3 : 3 voies — grille 3 colonnes desktop, 1 colonne mobile === */}
      <section className="relative w-full bg-[#fcf7f3] pt-4 md:pt-8 pb-16 md:pb-24 px-6 md:px-12">
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
          {CATEGORIES.map((cat) => {
            const imgKey = `${cat.dbKey}_img`;
            const titleKey = `${cat.dbKey}_title`;
            const subKey = `${cat.dbKey}_subtitle`;
            const catImg = getImage(imgKey);
            const catTitle = get(titleKey);
            const catSubtitle = get(subKey);
            const isSelected = isEditing && selectedKey === imgKey;

            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                onClick={(e) => { if (isEditing) e.preventDefault(); }}
                className="relative group block h-[58vh] md:h-[58vh] overflow-hidden"
              >
                {catImg && (
                  <div
                    onClick={() => handleImgClick(imgKey)}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:brightness-110 grayscale group-hover:grayscale-0 ${
                      isEditing ? 'cursor-pointer' : ''
                    } ${isSelected ? 'ring-4 ring-sage/40 ring-inset z-20' : ''}`}
                    style={{ backgroundImage: `url(${catImg})` }}
                  />
                )}

                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-all duration-500 z-[1]" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(titleKey, e)}
                    onClick={() => isEditing && onSelectKey?.(titleKey)}
                    className={`font-sans text-[11px] md:text-xs tracking-[0.42em] uppercase text-white/90 font-light outline-none transition-all duration-200 ${
                      isEditing ? 'cursor-text' : ''
                    } ${isEditing && selectedKey === titleKey ? 'ring-2 ring-sage/40 bg-black/20' : ''}`}
                  >
                    {catTitle}
                  </span>

                  <div className="w-0 group-hover:w-10 h-px bg-white/40 transition-all duration-500 mt-5" />

                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(subKey, e)}
                    onClick={() => isEditing && onSelectKey?.(subKey)}
                    className={`mt-5 max-w-[22ch] font-serif text-[13px] md:text-sm leading-relaxed tracking-[0.02em] text-white/55 font-light outline-none transition-all duration-200 ${
                      isEditing ? 'cursor-text' : ''
                    } ${isEditing && selectedKey === subKey ? 'ring-2 ring-sage/40 bg-black/20' : ''}`}
                  >
                    {catSubtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </section>
    </div>
  );
}
