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
  const bio = resolve('insta_bio');
  const btnText = resolve('insta_btn_text');

  return (
    <section 
      style={{
        backgroundColor: '#F5F2EB', // Même couleur sable que la section "Mes Galeries"
        borderTop: '1px solid #E5E2D9'
      }}
      className="relative w-full py-12 md:py-20 overflow-hidden"
    >
      {/* Texture de grain de papier organique un peu plus accentuée */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
          opacity: 0.45, // Opacité de 0.45 pour faire ressortir joliment la texture
        }}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
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
                className="w-full h-full object-cover"
              />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                Uploader...
              </div>
            )}
          </div>

          {/* Textes */}
          <div className="text-center md:text-left">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('insta_username', e)}
              onClick={() => isEditing && onSelectKey('insta_username')}
              className={`font-sans text-lg font-semibold text-neutral-900 outline-none rounded-xs whitespace-pre-wrap ${
                isEditing ? 'hover:ring-1 hover:ring-sage/40 cursor-text' : ''
              } ${isEditing && selectedKey === 'insta_username' ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
            >
              {username}
            </span>
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('insta_bio', e)}
              onClick={() => isEditing && onSelectKey('insta_bio')}
              className={`font-sans text-sm text-neutral-600 mt-1 whitespace-pre-line outline-none rounded-xs ${
                isEditing ? 'hover:ring-1 hover:ring-sage/40 cursor-text' : ''
              } ${isEditing && selectedKey === 'insta_bio' ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
            >
              {bio}
            </p>
          </div>
        </div>

        {/* Action (Bouton S'abonner aux couleurs du site, sans statistiques) */}
        <div className="flex flex-row items-center gap-4">
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
              className={`inline-block font-sans text-xs md:text-sm uppercase tracking-wider text-white bg-[#2C2C2C] border border-[#2C2C2C] px-6 py-2.5 rounded-none hover:bg-transparent hover:text-charcoal transition-all duration-300 outline-none whitespace-pre-wrap ${
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
