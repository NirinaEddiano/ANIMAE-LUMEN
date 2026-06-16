'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import InstagramSection from '@/components/InstagramSection';


interface ContentItem {
  key: string;
  value_fr: string;
  value_en: string;
  font_family: string;
  font_size: string;
  is_bold: boolean;
  is_image: boolean;
}

const REQUIRED_KEYS = [
  'discover_hero_image',
  'discover_hero_title',
  'discover_hero_subtitle',
  'discover_services_title',
  'portfolio_grid_bg_texture',
  'cat_1_title', 'cat_1_img',
  'cat_2_title', 'cat_2_img',
  'cat_3_title', 'cat_3_img',
  'cat_4_title', 'cat_4_img',
];

const CATEGORIES = [
  { dbKey: 'cat_1', slug: 'retreats' },
  { dbKey: 'cat_2', slug: 'festivals' },
  { dbKey: 'cat_3', slug: 'ceremonies' },
  { dbKey: 'cat_4', slug: 'portraits' },
] as const;

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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [fetched, setFetched] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEditing) { setLoading(false); return; }
    supabase
      .from('site_content')
      .select('*')
      .in('key', REQUIRED_KEYS)
      .then(({ data }) => {
        if (data) setFetched(data);
        setLoading(false);
      });
  }, [isEditing]);

  const items = isEditing ? dbContent : fetched;

  const get = (key: string): string => {
    const item = items.find((i) => i.key === key);
    if (!item) return '';
    return language === 'fr' ? item.value_fr : item.value_en;
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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-charcoal">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const heroImg = get('discover_hero_image');
  const heroTitle = get('discover_hero_title');
  const heroSub = get('discover_hero_subtitle');
  const servicesTitle = get('discover_services_title');
  const portfolioGridTexture = get('portfolio_grid_bg_texture');

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* === ZONE 1 : Hero (50vh) === */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
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
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-tight outline-none transition-all duration-200 ${
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
      <section className="relative h-[10vh] w-full flex items-center justify-center bg-clay/10 border-y border-clay/15">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("/paper.svg")',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.4,
          }}
        />
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

      {/* === ZONE 3 : 4 voies (65vh) — Carrousel mobile / Grille desktop === */}
      <section className="relative w-full bg-[#FDFCF8]">
        {portfolioGridTexture && (
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-multiply"
            style={{
              backgroundImage: `url(${portfolioGridTexture})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px 400px',
            }}
          />
        )}

        <div className="relative z-10">
          {/* Boutons Prev/Next mobile */}
          <button
            onClick={() => carouselRef.current?.scrollBy({ left: -window.innerWidth * 0.85, behavior: 'smooth' })}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Précédent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <button
            onClick={() => carouselRef.current?.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' })}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Suivant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <section ref={carouselRef} className="w-full h-[65vh] flex md:grid md:grid-cols-4 md:overflow-visible overflow-x-auto snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const imgKey = `${cat.dbKey}_img`;
            const titleKey = `${cat.dbKey}_title`;
            const catImg = get(imgKey);
            const catTitle = get(titleKey);
            const isSelected = isEditing && selectedKey === imgKey;

            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                onClick={(e) => { if (isEditing) e.preventDefault(); }}
                className="relative group block h-full min-w-[85vw] md:min-w-0 flex-shrink-0 snap-center overflow-hidden"
              >
                {catImg && (
                  <div
                    onClick={() => handleImgClick(imgKey)}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:brightness-110 ${
                      isEditing ? 'cursor-pointer' : ''
                    } ${isSelected ? 'ring-4 ring-sage/40 ring-inset z-20' : ''}`}
                    style={{ backgroundImage: `url(${catImg})` }}
                  />
                )}

                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500 z-[1]" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(titleKey, e)}
                    onClick={() => isEditing && onSelectKey?.(titleKey)}
                    className={`font-serif text-lg md:text-2xl lg:text-3xl tracking-[0.15em] text-white font-light outline-none transition-all duration-200 ${
                      isEditing ? 'cursor-text' : ''
                    } ${isEditing && selectedKey === titleKey ? 'ring-2 ring-sage/40 bg-black/20' : ''}`}
                  >
                    {catTitle}
                  </span>

                  <div className="w-0 group-hover:w-12 h-px bg-white/60 transition-all duration-500 mt-4" />
                </div>
              </Link>
            );
          })}
        </section>
        </div>

        <InstagramSection
          dbContent={dbContent}
          isEditing={isEditing}
          onUpdateText={onUpdateText}
          onSelectKey={onSelectKey}
          selectedKey={selectedKey}
        />
      </section>
    </div>
  );
}
