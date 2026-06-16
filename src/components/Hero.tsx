'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

interface HeroProps {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: ContentItem[];
}

const REQUIRED_KEYS = ['home_hero_title', 'home_hero_intro', 'home_hero_image', 'btn_discover'] as const;

export default function Hero({
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: HeroProps) {
  const { language } = useLanguage();
  const [fetched, setFetched] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch réel Supabase
  useEffect(() => {
    if (isEditing) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    supabase
      .from('site_content')
      .select('*')
      .in('key', REQUIRED_KEYS)
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
          setFetched([]);
        } else {
          setFetched(data || []);
        }
        setLoading(false);
      });
  }, [isEditing]);

  // Résolution : en admin → dbContent, sinon → fetched
  const items = isEditing ? dbContent : fetched;

  const get = (key: string): string => {
    const item = items.find((i) => i.key === key);
    if (!item) return '';
    return language === 'fr' ? item.value_fr : item.value_en;
  };

  const getStyle = (key: string): React.CSSProperties => {
    const item = items.find((i) => i.key === key);
    if (!item) return {};
    return {
      fontFamily: item.font_family || undefined,
      fontWeight: item.is_bold ? 'bold' : undefined,
    };
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

  // Écran de chargement
  if (loading) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-charcoal">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-charcoal text-white/40 font-sans text-xs tracking-widest uppercase">
        {error}
      </section>
    );
  }

  const heroImage = get('home_hero_image') || 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg';
  const isImgSelected = isEditing && selectedKey === 'home_hero_image';

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Hero — background-image CSS */}
      <div
        onClick={() => handleClick('home_hero_image')}
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
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl space-y-4 md:space-y-8">
          {/* Titre Hero */}
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('home_hero_title', e)}
            onClick={() => handleClick('home_hero_title')}
            style={getStyle('home_hero_title')}
            className={`text-white font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.06em] leading-[0.95] outline-none transition-all duration-200 ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === 'home_hero_title' ? 'ring-2 ring-sage/40 bg-white/5' : ''}`}
          >
            {get('home_hero_title')}
          </h1>

          {/* Sous-titre / Intro */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('home_hero_intro', e)}
            onClick={() => handleClick('home_hero_intro')}
            style={getStyle('home_hero_intro')}
            className={`text-white/60 font-sans text-xs md:text-sm lg:text-base font-light leading-relaxed tracking-wide max-w-lg mx-auto outline-none transition-all duration-200 ${
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
              className="group inline-block text-[10px] md:text-xs lg:text-sm uppercase tracking-[0.35em] border border-white/25 px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 hover:bg-white hover:border-white transition-all duration-500"
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
