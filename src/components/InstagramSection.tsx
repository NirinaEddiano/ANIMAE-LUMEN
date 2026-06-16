'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

const KEYS = ['insta_profile_img', 'insta_username', 'insta_bio', 'insta_stats', 'insta_btn_text', 'portfolio_grid_bg_texture'];

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
  insta_stats: { fr: '185 Abonnements', en: '185 Following' },
  insta_btn_text: { fr: 'Suivre', en: 'Follow' },
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

  const handleBlur = async (key: string, e: React.FocusEvent<HTMLSpanElement>) => {
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
      <section className="bg-[#FAF9F6] py-16 px-6 border-t border-neutral-200/40">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  const profileImg = resolve('insta_profile_img');
  const username = resolve('insta_username');
  const bio = resolve('insta_bio');
  const stats = resolve('insta_stats');
  const btnText = resolve('insta_btn_text');
  const bgTexture = resolve('portfolio_grid_bg_texture');

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-16 px-6 border-t border-neutral-200/40">
      {bgTexture && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply"
          style={{
            backgroundImage: `url(${bgTexture})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '500px auto',
          }}
        />
      )}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 max-w-3xl mx-auto">
        {/* Avatar */}
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm ring-2 ring-neutral-200 flex-shrink-0 ${
            isEditing ? 'cursor-pointer hover:ring-sage/60' : ''
          }`}
          onClick={() => {
            if (isEditing) {
              onSelectKey('insta_profile_img');
              fileInputRef.current?.click();
            }
          }}
        >
          <img src={profileImg} alt="Instagram" className="w-full h-full object-cover" />
        </div>
        {uploading && <p className="text-xs text-neutral-400">Upload...</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

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

        {/* Action */}
        <div className="flex flex-row items-center gap-4">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('insta_stats', e)}
            onClick={() => isEditing && onSelectKey('insta_stats')}
            className={`font-sans text-sm text-neutral-700 whitespace-pre-wrap outline-none rounded-xs ${
              isEditing ? 'hover:ring-1 hover:ring-sage/40 cursor-text' : ''
            } ${isEditing && selectedKey === 'insta_stats' ? 'ring-1 ring-sage/40 bg-neutral-50' : ''}`}
          >
            {stats}
          </span>
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
              className={`inline-block font-sans text-sm font-semibold text-white bg-[#3897f0] px-6 py-1.5 rounded-md hover:bg-[#2887e0] transition-colors outline-none whitespace-pre-wrap ${
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
