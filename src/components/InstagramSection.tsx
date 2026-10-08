'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { isHiddenKey, isUntranslated } from '@/lib/content';
import { SITE_BYLINE_DEFAULT, SITE_BYLINE_KEY, SITE_INSTAGRAM_DEFAULT } from '@/lib/navigation';

const KEYS = [
  'insta_profile_img',
  'insta_username',
  'insta_bio',
  'insta_btn_text',
  SITE_BYLINE_KEY,
];

const FALLBACKS: Record<string, { fr: string; en: string }> = {
  insta_profile_img: {
    fr: 'https://images.pexels.com/photos/2173842/pexels-photo-2173842.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    en: 'https://images.pexels.com/photos/2173842/pexels-photo-2173842.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  insta_username: { fr: SITE_INSTAGRAM_DEFAULT, en: SITE_INSTAGRAM_DEFAULT },
  insta_bio: {
    fr: 'Témoigner du sacré dans la présence humaine 𓆃\nRetraites, Cérémonies et Portraits',
    en: 'Witnessing the sacred in human presence 𓆃\nRetreats, Ceremonies and Portraits',
  },
  insta_btn_text: { fr: 'S\'abonner', en: 'Follow' },
  // La signature est identique dans les deux langues, c'est voulu.
  [SITE_BYLINE_KEY]: { fr: SITE_BYLINE_DEFAULT, en: SITE_BYLINE_DEFAULT },
};

const autoTranslate = async (text: string): Promise<string> => {
  if (!text.trim()) return '';
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0].map((t: any) => t[0]).join('');
  } catch {
    return text;
  }
};

export default function InstagramSection({
  dbContent = [],
  isEditing = false,
  onUpdateText = () => {},
  onSelectKey = () => {},
  selectedKey = null,
  backgroundColor,
  className,
  compact = false,
}: {
  dbContent?: any[];
  isEditing?: boolean;
  onUpdateText?: (key: string, value: string) => void;
  onSelectKey?: (key: string) => void;
  selectedKey?: string | null;
  backgroundColor?: string;
  className?: string;
  // Version discrete : avatar, pseudo et bouton reduits. Utilisee dans le
  // pied de page, ou le bloc doit rester tres efface.
  compact?: boolean;
}) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(!isEditing);
  const [fetched, setFetched] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) return;
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from('site_content').select('*').in('key', KEYS);
      if (data) setFetched(data);
      setLoading(false);
    };
    fetchData();
  }, [isEditing]);

  const findRow = (key: string) => [...dbContent, ...fetched].find((c: any) => c.key === key);

  /** Texte : si value_en n'est qu'une copie du français, la traduction n'a jamais
   *  eu lieu → on retombe sur le repli localisé. */
  const resolveText = (key: string): string => {
    const fromDb = findRow(key);
    if (fromDb?.is_deleted) return '';
    if (fromDb && !(language === 'en' && isUntranslated(fromDb))) {
      const val = ((language === 'fr' ? fromDb.value_fr : fromDb.value_en) || '').trim();
      if (val) return val;
    }
    return FALLBACKS[key]?.[language] || FALLBACKS[key]?.fr || '';
  };

  /** Image : JAMAIS de contrôle isUntranslated. Pour une image, value_en et
   *  value_fr sont légitimement identiques (même URL) — les traiter comme
   *  « non traduites » faisait disparaître la photo en anglais. */
  const resolveImage = (key: string): string => {
    const fromDb = findRow(key);
    const val = ((fromDb?.value_en as string) || (fromDb?.value_fr as string) || '').trim();
    return val || FALLBACKS[key]?.[language] || FALLBACKS[key]?.fr || '';
  };

  const handleBlur = async (key: string, e: React.FocusEvent<HTMLElement>) => {
    const frValue = e.currentTarget.innerText.trim();
    if (!frValue) return;
    onUpdateText(key, frValue);
    try {
      const enValue = key === 'insta_username' ? frValue : await autoTranslate(frValue);
      await supabase.from('site_content').upsert(
        { key, value_fr: frValue, value_en: enValue },
        { onConflict: 'key' }
      );
    } catch {
      await supabase.from('site_content').upsert(
        { key, value_fr: frValue },
        { onConflict: 'key' }
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `insta_profile_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl || '';
      if (publicUrl) {
        await supabase.from('site_content').upsert(
          { key: 'insta_profile_img', value_fr: publicUrl, value_en: publicUrl, is_image: true },
          { onConflict: 'key' }
        );
        onUpdateText('insta_profile_img', publicUrl);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  if (!isEditing && loading) {
    return (
      <section className="relative w-full py-12 md:py-20 flex items-center justify-center bg-[#F5F2EB]">
        <div className="w-6 h-6 border-2 border-charcoal/20 border-t-charcoal/80 rounded-full animate-spin" />
      </section>
    );
  }

  const profileImg = resolveImage('insta_profile_img');
  const username = resolveText('insta_username');
  const btnText = resolveText('insta_btn_text');
  const byline = resolveText(SITE_BYLINE_KEY);

  return (
    <section 
      style={backgroundColor ? {
        backgroundColor
      } : {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23F7F5F0' surfaceScale='1.0'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', // Évite l'étirement flou
        backgroundSize: '180px 180px', // Maintient le grain très fin et précis
      }}
      className={`relative w-full py-16 md:py-24 overflow-hidden ${className ?? ''} ${
        KEYS.every((k) => isHiddenKey([...dbContent, ...fetched], k)) ? 'hidden' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="relative z-10 max-w-md mx-auto px-6 flex flex-col items-center justify-center text-center gap-5">
        
        {/* Avatar */}
        <div
          className={`group ${compact ? 'w-14 h-14 md:w-16 md:h-16' : 'w-20 h-20 md:w-24 md:h-24'} rounded-full overflow-hidden shadow-sm ring-2 ring-neutral-200 flex-shrink-0 relative ${
            isEditing ? 'cursor-pointer hover:ring-sage/60' : ''
          }`}
          onClick={() => {
            if (isEditing) {
              onSelectKey('insta_profile_img');
              fileInputRef.current?.click();
            }
          }}
        >
          {profileImg && (
            <img
              src={profileImg}
              alt="Instagram Avatar"
              className="w-full h-full object-cover animate-fade-in grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
              Uploader...
            </div>
          )}
        </div>

        {/* Nom d'utilisateur + signature de l'artiste. Le nom Instagram n'est pas
            modifie : seule la signature s'ajoute a sa droite, plus petite. */}
        <div className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('insta_username', e)}
            onClick={() => isEditing && onSelectKey('insta_username')}
            className={`font-sans ${compact ? 'text-sm md:text-[15px] font-medium text-neutral-900/75' : 'text-base md:text-lg font-semibold text-neutral-900'} outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:ring-1 hover:ring-sage/40 cursor-text' : ''
            } ${isEditing && selectedKey === 'insta_username' ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
          >
            {username}
          </span>

          <span
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(SITE_BYLINE_KEY, e)}
            onClick={() => isEditing && onSelectKey(SITE_BYLINE_KEY)}
            className={`site-byline text-[11px] md:text-xs text-neutral-900/55 whitespace-nowrap outline-none ${
              isEditing ? 'cursor-text' : ''
            } ${isEditing && selectedKey === SITE_BYLINE_KEY ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
          >
            {byline}
          </span>
        </div>

        {/* Bouton S'abonner centré en dessous */}
        <div className="mt-2">
          <a
            href="https://www.instagram.com/animaelumen"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                onSelectKey('insta_btn_text');
              }
            }}
          >
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('insta_btn_text', e)}
              onClick={() => isEditing && onSelectKey('insta_btn_text')}
              className={`inline-block font-sans uppercase tracking-wider text-white bg-[#2C2C2C] border border-[#2C2C2C] rounded-none hover:bg-transparent hover:text-charcoal transition-all duration-300 outline-none whitespace-pre-wrap ${
                compact ? 'text-[10px] md:text-[11px] px-6 py-2.5' : 'text-[13px] md:text-[15px] px-8 py-2.5'
              } ${
                isEditing ? 'cursor-text' : ''
              } ${isEditing && selectedKey === 'insta_btn_text' ? 'ring-2 ring-sage/60' : ''}`}
            >
              {btnText}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
