'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { fontFamilyWithFallback, isDeleted, isHidden, isUntranslated } from '@/lib/content';

interface DynamicTextProps {
  dbKey: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  defaultText?: string;
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}

export default function DynamicText({
  dbKey,
  as: Tag = 'span',
  className = '',
  defaultText = '',
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: DynamicTextProps) {
  const { language } = useLanguage();
  const [localItem, setLocalItem] = useState<any>(null);

  useEffect(() => {
    if (isEditing) return;
    supabase
      .from('site_content')
      .select('*')
      .eq('key', dbKey)
      .single()
      .then(({ data }) => {
        if (data) setLocalItem(data);
      });
  }, [dbKey, isEditing]);

  const item = isEditing
    ? dbContent.find((i: any) => i.key === dbKey)
    : localItem;

  // EN identique au FR (traduction jamais faite) → repli anglais codé en dur.
  // Côté FR, value_fr fait toujours foi.
  const value = !item || (language === 'en' && isUntranslated(item))
    ? defaultText
    : (((language === 'fr' ? item.value_fr : item.value_en) || '').trim() || defaultText);

  const isSelected = isEditing && selectedKey === dbKey;

  // Masquage choisi par l'admin : rien ne s'affiche sur le site public. En
  // edition l'element reste visible en fantome, sinon il serait impossible a
  // retrouver pour le reafficher.
  const hidden = isHidden(item);
  const deleted = isDeleted(item);

  const style: React.CSSProperties = {};
  if (item?.font_family) style.fontFamily = fontFamilyWithFallback(item.font_family);
  if (item?.font_size) style.fontSize = item.font_size;
  if (item?.is_bold) style.fontWeight = 'bold';

  const handleClick = () => {
    if (isEditing && onSelectKey) onSelectKey(dbKey);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (isEditing && onUpdateText) {
      onUpdateText(dbKey, e.currentTarget.innerText || '');
    }
  };

  if (deleted || (hidden && !isEditing)) return null;

  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      style={style}
      className={`outline-none transition-all duration-200 ${
        item?.is_stamped ? 'effect-letterpress' : ''
      } ${
        className
      } ${
        isEditing ? 'cursor-text' : ''
      } ${
        isSelected ? 'ring-2 ring-sage/40 bg-sand/30' : ''
      } ${
        hidden ? 'opacity-40 line-through decoration-charcoal/40' : ''
      }`}
    >
      {hidden ? `[masqué] ${value}` : value}
    </Tag>
  );
}
