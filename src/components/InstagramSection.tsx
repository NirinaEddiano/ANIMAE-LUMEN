'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

const KEYS = [
  'insta_profile_img',
  'insta_username',
  'insta_bio',
  'insta_btn_text'
];

const FALLBACKS: Record<string, { fr: string; en: string }> = {
  insta_profile_img: {
    fr: 'https://images.pexels.com/photos/2173842/pexels-photo-2173842.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    en: 'https://images.pexels.com/photos/2173842/pexels-photo-2173842.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  insta_username: { fr: '@animaelumen', en: '@animaelumen' },
  insta_bio: {
    fr: 'Témoigner du sacré dans la présence humaine 𓆃\nRetraites, Cérémonies et Portraits',
    en: 'Witnessing the sacred in human presence 𓆃\nRetreats, Ceremonies and Portraits',
  },
  insta_btn_text: { fr: 'S\'abonner', en: 'Follow' },
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
}: {
  dbContent?: any[];
  isEditing?: boolean;
  onUpdateText?: (key: string, value: string) => void;
  onSelectKey?: (key: string) => void;
  selectedKey?: string | null;
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

  const resolve = (key: string): string => {
    const fromDb = [...dbContent, ...fetched].find((c: any) => c.key === key);
    if (fromDb) {
      const val = language === 'fr' ? fromDb.value_fr : fromDb.value_en;
      if (val) return val;
    }
    return FALLBACKS[key]?.[language] || FALLBACKS[key]?.fr || '';
  };

  const handleBlur = async (key: string, e: React.FocusEvent<HTMLElement>) => {
    const frValue = e.currentTarget.innerText.trim();
    if (!frValue) return;
    onUpdateText(key, frValue);
    try {
      const enValue = await autoTranslate(frValue);
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

  const profileImg = resolve('insta_profile_img');
  const username = resolve('insta_username');
  const btnText = resolve('insta_btn_text');

  return (
    <section 
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23F7F5F0' surfaceScale='1.0'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', // Évite l'étirement flou
        backgroundSize: '180px 180px', // Maintient le grain très fin et précis
        borderTop: '1px solid #E5E2D9'
      }}
      className="relative w-full py-16 md:py-24 overflow-hidden"
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
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm ring-2 ring-neutral-200 flex-shrink-0 relative ${
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
              className="w-full h-full object-cover animate-fade-in"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
              Uploader...
            </div>
          )}
        </div>

        {/* Nom d'utilisateur */}
        <div className="mt-1">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('insta_username', e)}
            onClick={() => isEditing && onSelectKey('insta_username')}
            className={`font-sans text-base md:text-lg font-semibold text-neutral-900 outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:ring-1 hover:ring-sage/40 cursor-text' : ''
            } ${isEditing && selectedKey === 'insta_username' ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
          >
            {username}
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
              className={`inline-block font-sans text-xs md:text-sm uppercase tracking-wider text-white bg-[#2C2C2C] border border-[#2C2C2C] px-8 py-2.5 rounded-none hover:bg-transparent hover:text-charcoal transition-all duration-300 outline-none whitespace-pre-wrap ${
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
