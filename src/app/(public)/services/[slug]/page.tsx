'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { fieldFor, isHiddenKey, readContent, readImage } from '@/lib/content';


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

const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  souls: { fr: 'Âmes', en: 'Souls' },
  events: { fr: 'Événements', en: 'Events' },
  retreats: { fr: 'Retraites', en: 'Retreats' },
};

// Les 3 services. Les anciennes catégories de la base sont encore mappées ici
// pour que les pages restent alimentées avant l'exécution de la migration SQL.
export const CATEGORY_ALIASES: Record<string, string[]> = {
  souls: ['souls', 'portraits'],
  events: ['events', 'festivals'],
  retreats: ['retreats', 'ceremonies'],
};

// Replis code par catégorie : garantissent que le site reste en anglais même si
// la base contient une value_en identique au français (traduction jamais faite).
const SERVICE_DEFAULTS: Record<string, { title: { fr: string; en: string }; desc: { fr: string; en: string } }> = {
  souls: {
    title: { fr: 'ÂMES', en: 'SOULS' },
    desc: {
      fr: 'Portraits et travail autour de l’humain',
      en: 'Portraits and work around the human',
    },
  },
  events: {
    title: { fr: 'ÉVÉNEMENTS', en: 'EVENTS' },
    desc: {
      fr: 'Festivals, musique et événements, Travel',
      en: 'Festivals, music and events, Travel',
    },
  },
  retreats: {
    title: { fr: 'RETRAITES', en: 'RETREATS' },
    desc: {
      fr: 'Retraites et cérémonies',
      en: 'Retreats and ceremonies',
    },
  },
};

// Photo de hero par défaut : les 3 services en ont une, la page n'affiche
// jamais un cadre noir nu. Modifiable depuis l'admin (clé `hero_<service>_bg`).
const SERVICE_HERO: Record<string, string> = {
  souls: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',
  events: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=80',
  retreats: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
};

export default function ServiceCategoryPage({
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
  forcedSlug,
}: {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
  /** Utilisé par l'admin pour éditer un service sans passer par la route. */
  forcedSlug?: string;
}) {
  const params = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const slug = forcedSlug ?? params.slug;

  const prefix = `hero_${slug}`;
  const images = SERVICE_HERO[slug] ?? SERVICE_HERO.souls;

  const HERO_KEYS = [
    `${prefix}_title`, `${prefix}_desc`, `${prefix}_bg`,
  ];
  const categories = CATEGORY_ALIASES[slug] ?? [slug];

  const [fetchedContent, setFetchedContent] = useState<ContentItem[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing) return;
    Promise.all([
      supabase.from('site_content').select('*').in('key', HERO_KEYS),
      supabase.from('portfolios').select('*').in('category', categories),
    ]).then(([contentRes, portfolioRes]) => {
      if (contentRes.data) setFetchedContent(contentRes.data);
      if (portfolioRes.data) setPortfolios(portfolioRes.data);
    });
  }, [slug, isEditing]);

  const items = isEditing ? dbContent : fetchedContent;

  // Masquage choisis par l'administrateur : un bloc disparait du site
  // public quand TOUS ses contenus sont masques. La condition 'every'
  // evite de laisser un trou de mise en page si un seul element reste.
  const hidden = (...keys: string[]) => keys.every((k) => isHiddenKey(items, k));

  const defaults = SERVICE_DEFAULTS[slug];
  const get = (key: string): string => {
    if (key === `${prefix}_title`) return readContent(items, key, language, defaults?.title[language] ?? '');
    if (key === `${prefix}_desc`) return readContent(items, key, language, defaults?.desc[language] ?? '');
    return readContent(items, key, language, '');
  };

  const getImage = (key: string): string => {
    if (key === `${prefix}_bg`) return readImage(items, key, images);
    return readImage(items, key, '');
  };

  const getStampClass = (key: string): string => {
    const item = items.find((i) => i.key === key);
    return item?.is_stamped ? 'effect-letterpress' : '';
  };

  const handleBlur = (key: string, e: React.FocusEvent<HTMLElement>) => {
    const val = e.currentTarget.innerText || '';
    if (isEditing && onUpdateText) {
      onUpdateText(key, val);
    } else if (isEditing) {
      supabase.from('site_content').update({ [fieldFor(language)]: val }).eq('key', key).then();
    }
  };

  const handleImgClick = (key: string) => {
    if (isEditing && onSelectKey) {
      onSelectKey(key);
      document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
    }
  };

  const labels = CATEGORY_LABELS[slug] ?? { fr: slug, en: slug };

  const heroBg = getImage(`${prefix}_bg`);
  const heroTitle = get(`${prefix}_title`) || labels[language];
  const heroDesc = get(`${prefix}_desc`);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* === HERO (50vh) === */}
      <section className={`relative h-[50vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white ${hidden(`${prefix}_bg`, `${prefix}_title`, `${prefix}_desc`) ? 'hidden' : ''}`}>
        {heroBg && (
          <div
            onClick={() => handleImgClick(`${prefix}_bg`)}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 grayscale ${
              isEditing ? 'cursor-pointer hover:brightness-75' : ''
            } ${isEditing && selectedKey === `${prefix}_bg` ? 'ring-4 ring-sage/40 ring-inset' : ''}`}
            style={{ backgroundImage: `url(${heroBg})` }}
          />
        )}
        <div className="absolute inset-0 bg-neutral-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("/grain.svg")',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            mixBlendMode: 'multiply',
            opacity: 0.4,
          }}
        />

        <div className="relative z-10 text-center max-w-3xl space-y-5 md:space-y-7 px-4">
          <span className="font-sans text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-light text-neutral-400/80 block">
            {language === 'fr' ? labels.fr : labels.en}
          </span>

          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(`${prefix}_title`, e)}
            onClick={() => isEditing && onSelectKey?.(`${prefix}_title`)}
            className={`font-sans text-[13px] md:text-sm tracking-[0.42em] uppercase font-light text-white/85 outline-none transition-all duration-200 ${getStampClass(`${prefix}_title`)} ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === `${prefix}_title` ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {heroTitle}
          </h1>

          <div className="w-8 h-px bg-white/25 mx-auto" />

          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(`${prefix}_desc`, e)}
            onClick={() => isEditing && onSelectKey?.(`${prefix}_desc`)}
            className={`font-serif text-[13px] md:text-sm leading-relaxed tracking-[0.02em] font-light text-neutral-300/70 max-w-sm mx-auto outline-none transition-all duration-200 ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === `${prefix}_desc` ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {heroDesc}
          </p>
        </div>
      </section>

      {/* === GRILLE DES PORTFOLIOS === */}
      <section
        style={{
          backgroundColor: '#fcf7f3'
        }}
        className={`relative w-full overflow-hidden pt-16 md:pt-24 pb-16 md:pb-24 px-8 md:px-16 ${hidden(`${prefix}_body`) ? 'hidden' : ''}`}
      >
        <div className="relative z-10 max-w-6xl mx-auto">
        {portfolios.length === 0 ? (
          <p className="text-center font-sans text-xs tracking-[0.2em] uppercase text-neutral-400 font-light">
            {language === 'fr' ? 'Aucun projet dans cette catégorie' : 'No projects in this category'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-3">
            {portfolios.map((project: any) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.id}`}
                className="relative group block h-[65vh] md:h-[60vh] overflow-hidden"
              >
                <img
                  src={project.images?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                  alt={language === 'fr' ? project.title_fr : project.title_en}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:brightness-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                  <h3 className="font-serif text-sm md:text-lg lg:text-xl tracking-[0.15em] text-white font-light">
                    {language === 'fr' ? project.title_fr : project.title_en}
                  </h3>
                  <div className="w-0 group-hover:w-12 h-px bg-white/60 transition-all duration-500 mt-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </section>

    </main>
  );
}
