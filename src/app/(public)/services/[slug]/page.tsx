'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';


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
  retreats: { fr: 'Retraites Spirituelles', en: 'Spiritual Retreats' },
  festivals: { fr: 'Festivals Conscients', en: 'Conscious Festivals' },
  ceremonies: { fr: 'Cérémonies Sacrées', en: 'Sacred Ceremonies' },
  portraits: { fr: 'Portraits Thérapeutiques', en: 'Therapeutic Portraits' },
};

const autoTranslate = async (text: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    if (data?.[0]) return data[0].map((s: any) => s[0]).join('');
    return text;
  } catch {
    return text;
  }
};

export default function ServiceCategoryPage({
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
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const prefix = `hero_${slug}`;
  const HERO_KEYS = [`${prefix}_title`, `${prefix}_desc`, `${prefix}_bg`, 'portfolio_grid_bg_texture'];

  const [fetchedContent, setFetchedContent] = useState<ContentItem[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEditing) { setLoading(false); return; }
    Promise.all([
      supabase.from('site_content').select('*').in('key', HERO_KEYS),
      supabase.from('portfolios').select('*').eq('category', slug),
    ]).then(([contentRes, portfolioRes]) => {
      if (contentRes.data) setFetchedContent(contentRes.data);
      if (portfolioRes.data) setPortfolios(portfolioRes.data);
      setLoading(false);
    });
  }, [slug, isEditing]);

  const items = isEditing ? dbContent : fetchedContent;

  const get = (key: string): string => {
    const item = items.find((i) => i.key === key);
    if (!item) return '';
    return language === 'fr' ? item.value_fr : item.value_en;
  };

  const getStampClass = (key: string): string => {
    const item = items.find((i) => i.key === key);
    return item?.is_stamped ? 'effect-letterpress' : '';
  };

  const handleBlur = async (key: string, e: React.FocusEvent<HTMLElement>) => {
    const val = e.currentTarget.innerText || '';
    if (isEditing && onUpdateText) {
      onUpdateText(key, val);
    } else if (isEditing) {
      const translated = await autoTranslate(val);
      await supabase.from('site_content').upsert({
        key,
        value_fr: val,
        value_en: translated,
      }).eq('key', key);
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
      <div className="min-h-screen w-full flex items-center justify-center bg-charcoal">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const labels = CATEGORY_LABELS[slug] || { fr: slug, en: slug };
  const heroBg = get(`${prefix}_bg`);
  const heroTitle = get(`${prefix}_title`);
  const heroDesc = get(`${prefix}_desc`);
  const portfolioGridTexture = get('portfolio_grid_bg_texture');

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* === HERO (50vh) === */}
      <section className="relative h-[50vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
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

        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4">
          <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block">
            {language === 'fr' ? labels.fr : labels.en}
          </span>

          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(`${prefix}_title`, e)}
            onClick={() => isEditing && onSelectKey?.(`${prefix}_title`)}
            className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none transition-all duration-200 ${getStampClass(`${prefix}_title`)} ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === `${prefix}_title` ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {heroTitle}
          </h1>

          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(`${prefix}_desc`, e)}
            onClick={() => isEditing && onSelectKey?.(`${prefix}_desc`)}
            className={`font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto outline-none transition-all duration-200 ${
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
        className="relative w-full overflow-hidden pt-16 md:pt-24 pb-16 md:pb-24 px-8 md:px-16"
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
