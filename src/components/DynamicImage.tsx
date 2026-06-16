'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface DynamicImageProps {
  dbKey: string;
  className?: string;
  defaultImage?: string;
  alt?: string;
  containerClassName?: string;
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}

export default function DynamicImage({
  dbKey,
  className = '',
  defaultImage = '',
  alt = '',
  containerClassName = '',
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: DynamicImageProps) {
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

  const url = item
    ? (language === 'fr' ? item.value_fr : item.value_en)
    : defaultImage;

  const isSelected = isEditing && selectedKey === dbKey;

  const handleClick = () => {
    if (isEditing && onSelectKey) {
      onSelectKey(dbKey);
      document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`overflow-hidden ${containerClassName} ${
        isEditing ? 'cursor-pointer hover:brightness-90' : ''
      } ${isSelected ? 'ring-4 ring-sage/40 ring-inset' : ''}`}
      role={isEditing ? 'button' : undefined}
      tabIndex={isEditing ? 0 : undefined}
    >
      {url ? (
        <img
          src={url}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
        />
      ) : (
        <div className={`w-full h-full bg-sage/10 ${className}`} />
      )}
    </div>
  );
}
