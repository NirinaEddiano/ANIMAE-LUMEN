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
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
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
            className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none transition-all duration-200 ${
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23F7F5F0' surfaceScale='1.0'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', // Force la répétition pour éviter le flou étiré
          backgroundSize: '180px 180px', // Garde un grain de papier fin et précis
        }}
        className="relative w-full overflow-hidden"
      >
        {/* L'ancienne div de texture dynamique "portfolioGridTexture" a été supprimée pour éliminer l'ancien grain artificiel */}

        <div className="relative z-10 max-w-[85rem] mx-auto pt-16 md:pt-20 pb-16 md:pb-24 px-4 md:px-8">
        {portfolios.length === 0 ? (
          <p className="text-center font-sans text-xs tracking-[0.2em] uppercase text-neutral-400 font-light">
            {language === 'fr' ? 'Aucun projet dans cette catégorie' : 'No projects in this category'}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {portfolios.map((project: any) => (
              <div key={project.id} className="flex flex-col space-y-4 group">
                <Link href={`/portfolio/${project.id}`}>
                  <div className="bg-white p-2 shadow-md hover:shadow-xl transition-shadow duration-500">
                    <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative cursor-pointer">
                      <img
                        src={project.images?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                        alt={language === 'fr' ? project.title_fr : project.title_en}
                        className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    </div>
                  </div>
                </Link>

                <div className="space-y-2 px-1">
                  <span className="font-sans text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                    {language === 'fr' ? labels.fr : labels.en}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl tracking-wide font-light text-neutral-900 leading-snug">
                    {language === 'fr' ? project.title_fr : project.title_en}
                  </h3>
                  <div className="pt-1">
                    <Link
                      href={`/portfolio/${project.id}`}
                      className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light text-neutral-500 group-hover:text-neutral-950 border-b border-neutral-300 group-hover:border-neutral-950 pb-1 transition-all duration-500 inline-block"
                    >
                      {language === 'fr' ? 'Découvrir la galerie →' : 'Explore the gallery →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>

    </main>
  );
}
